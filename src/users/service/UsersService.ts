import {ForbiddenException, Inject, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRegisterRequest} from "../payload/UserRegisterRequest";
import {User} from "../entity/User";
import {UserAlreadyExistsError} from "../error/UserAlreadyExistsError";
import {UserRepository} from "../repository/UserRepository";
import * as bcrypt from 'bcrypt';
import {PasswordsMismatchError} from "../error/PasswordsMismatchError";
import * as fs from "fs";
import {UserProfileEditRequest} from "../payload/UserProfileEditRequest";
import {ConfigType} from "@nestjs/config";
import FileConfig from "../../config/FileConfig";
import {Role} from "../entity/Role";
import {LessThanOrEqual, MoreThanOrEqual, Repository} from "typeorm";
import {UserProfileViewModel} from "../payload/UserProfileViewModel";
import {RoleInfoViewModel} from "../payload/RoleInfoViewModel";
import {UserRoleHistory} from "../entity/UserRoleHistory";
import {UserRateViewModel} from "../entity/UserRateViewModel";
import {GroupCreateRequest} from "../payload/GroupCreateRequest";
import {Group} from "../entity/Group";
import {GroupPreviewModel} from "../payload/GroupPreviewModel";
import {GroupEditRequest} from "../payload/GroupEditRequest";
import {GroupViewModel} from "../payload/GroupViewModel";
import {GroupMemberViewModel} from "../payload/GroupMemberViewModel";
import {SpherePreviewModel} from "../payload/SpherePreviewModel";
import {Sphere} from "../entity/Sphere";
import {CalendarEventCreateRequest} from "../payload/CalendarEventCreateRequest";
import {EventType} from "../entity/EventType";
import {GroupCalendar} from "../entity/GroupCalendar";
import {GroupRoleRestriction} from "../entity/GroupRoleRestriction";
import {EventInfoViewModel} from "../payload/EventInfoViewModel";
import {NotAnOwnerError} from "../../core/error/NotAnOwnerError";
import {EventSlotAlreadyUsedError} from "../error/EventSlotAlreadyUsedError";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: UserRepository,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(UserRoleHistory) private readonly historyRepository: Repository<UserRoleHistory>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @InjectRepository(Sphere) private readonly sphereRepository: Repository<Sphere>,
        @InjectRepository(GroupCalendar) private readonly calendarRepository: Repository<GroupCalendar>,
        @InjectRepository(GroupRoleRestriction) private readonly groupRoleRestrictionRepository: Repository<GroupRoleRestriction>,
        @Inject(FileConfig.KEY) private readonly fileConfig: ConfigType<typeof FileConfig>
    ) {
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findAllSorted(): Promise<UserRateViewModel[]> {
        return (await this.userRepository.find())
            .map(u => new UserRateViewModel(u.id, u.name, u.points))
            .sort((u1, u2) => u2.points - u1.points);
    }

    async register(model: UserRegisterRequest): Promise<User> {
        if (await this.userRepository.findByUsername(model.username)) {
            throw new UserAlreadyExistsError();
        }

        if (model.password !== model.confirm) {
            throw new PasswordsMismatchError();
        }

        model.password = bcrypt.hashSync(model.password, 10);

        return this.userRepository.save(Object.assign(new User(), model));
    }

    async findByUsername(username: string): Promise<User> {
        return this.userRepository.findByUsername(username);
    }

    async find(userId: number): Promise<User> {
        return this.userRepository.findOne(userId);
    }

    async saveFile(file) {
        const now = new Date();

        fs.writeFileSync(
            this.fileConfig.destination + now.getTime() + file.originalname,
            file.buffer
        );

        return this.fileConfig.staticRoot + encodeURIComponent(now.getTime() + file.originalname);
    }

    async edit(
        userId,
        model: UserProfileEditRequest,
        avatar
    ): Promise<UserProfileViewModel> {
        let user = await this.find(userId);
        let spheres = [];

        model.sphereIds.forEach(async sId => {
            let sphere = await this.sphereRepository.findOne(sId);
            spheres.push(sphere);
        });

        user.name = model.name;
        user.description = model.description;
        user.spheres = spheres;

        if (await this.isUserEligibleToChangeRole(userId)) {
            const lastHistory = await this.findLastRoleChange(userId);
            if (lastHistory) {
                lastHistory.finishedOn = new Date();
                await this.historyRepository.save(lastHistory);
            }

            user.role = await this.roleRepository.findOne(model.roleId);
        }

        let userRoleHistory = new UserRoleHistory();
        userRoleHistory.user = user;
        userRoleHistory.role = user.role;
        userRoleHistory.points = user.points;
        userRoleHistory.selectedOn = new Date();
        userRoleHistory.finishedOn = null;
        await this.historyRepository.save(userRoleHistory);

        if (avatar !== undefined) {
            user.avatarUrl = await this.saveFile(avatar);
        }

        if (model.password !== '' && model.password === model.confirm) {
            user.password = bcrypt.hashSync(model.password, 10);
        }

        user = await this.userRepository.save(user);

        return new UserProfileViewModel(
            user.username,
            user.name,
            user.avatarUrl,
            user.description,
            user.points,
            new RoleInfoViewModel(user.role.id, user.role.name, user.role.theme),
            user.spheres.map(s => new SpherePreviewModel(s.id, s.name))
        );
    }

    async findAllRoles(): Promise<RoleInfoViewModel[]> {
        return (await this.roleRepository.find()).map(r => new RoleInfoViewModel(r.id, r.name, r.theme));
    }

    async isUserEligibleToChangeRole(userId): Promise<boolean> {
        const history = await this.findLastRoleChange(userId);

        return !history || new Date().getTime() - history.selectedOn.getTime() >= 365 * 24 * 3600 * 1000;
    }

    async findLastRoleChange(userId: number): Promise<UserRoleHistory> {
        return this.historyRepository.findOne({
            where: {
                user: {
                    id: userId
                },
                finishedOn: null
            }
        });
    }

    async findUsersByIds(userIds: number[]): Promise<User[]> {
        let users: User[] = [];

        for (let userId of userIds) {
            let user = await this.userRepository.findOne(userId);
            users.push(user);
        }

        return users;
    }

    async createGroup(request: GroupCreateRequest): Promise<GroupCreateRequest> {
        let group = new Group();

        group.name = request.name;
        group.users = await this.findUsersByIds(request.userIds);

        await this.groupRepository.save(group);

        return new GroupCreateRequest(group.name, group.users.map(u => u.id));
    }

    async findGroups(): Promise<GroupPreviewModel[]> {
        let groups = await this.groupRepository.find();

        return groups.map(g => new GroupPreviewModel(g.id, g.name, g.avatarUrl));
    }

    async findGroupDetails(groupId: number): Promise<GroupViewModel> {
        let group = await this.groupRepository.findOne(groupId);

        let members = group.users.map(u => new GroupMemberViewModel(u.id, u.name));

        return new GroupViewModel(
            group.name,
            group.avatarUrl,
            group.description,
            group.backgroundColor,
            group.backgroundUrl,
            group.innerBackgroundColor,
            group.fontColor,
            members
        );
    }

    async editGroup(
        id: number,
        request: GroupEditRequest,
        avatar,
        background
    ) {
        let group = await this.groupRepository.findOne(id);

        group.name = request.name;
        group.users = await this.findUsersByIds(request.userIds);
        group.description = request.description;
        group.backgroundColor = request.backgroundColor;
        group.innerBackgroundColor = request.innerBackgroundColor;
        group.fontColor = request.fontColor;

        if (avatar !== undefined) {
            group.avatarUrl = await this.saveFile(avatar);
        }

        if (background !== undefined) {
            group.backgroundUrl = await this.saveFile(background);
        }
    }

    async findSpheres(): Promise<SpherePreviewModel[]> {
        return (await this.sphereRepository.find()).map(s => new SpherePreviewModel(s.id, s.name));
    }

    async createGroupAppointment(groupId: number, userId: number, createEventModel: CalendarEventCreateRequest)
        : Promise<EventInfoViewModel> {
        const eventType = UsersService.getEventType(createEventModel.typeId);
        const group = this.groupRepository.findOne(groupId);
        const user = this.find(userId);

        if (!(await user).isAdmin) {
            const restriction = await this.groupRoleRestrictionRepository.findOne({
                where: {
                    role: new Promise(async () => (await user).role),
                    eventType: eventType
                }
            });

            if (!restriction || !(await user).groups.some(g => g.id === groupId)) {
                throw new ForbiddenException();
            }
        }

        const otherEvents = await this.calendarRepository.find(
            {
                where: {
                    from: MoreThanOrEqual(createEventModel.from),
                    to: LessThanOrEqual(createEventModel.to)
                }
            }
        );

        for (const eventDetails of otherEvents) {
            if (
                (eventDetails.from.getHours() >= createEventModel.from.getHours()
                    && eventDetails.from.getHours() <= createEventModel.to.getHours())
                ||
                (
                    (eventDetails.to.getHours() >= createEventModel.from.getHours()
                        && eventDetails.to.getHours() <= createEventModel.to.getHours())
                )
            ) {
                throw new EventSlotAlreadyUsedError();
            }
        }

        const event = new GroupCalendar();
        event.from = createEventModel.from;
        event.to = createEventModel.to;
        event.eventType = eventType;
        event.createdBy = user;
        event.group = group;

        this.calendarRepository.save(event);

        return new EventInfoViewModel(
            event.from,
            event.to,
            event.eventType
        );
    }

    async getGroupAppointments(groupId: number, userId: number, from: Date = null, to: Date = null)
        : Promise<EventInfoViewModel[]> {
        const user = this.find(userId);
        if (!(await user).groups.some(g => g.id === groupId)) {
            throw new NotAnOwnerError();
        }

        let whereClause = {
            group: {
                id: groupId
            }
        };

        if (from) {
            let newWhere = {
                from: MoreThanOrEqual(from)
            };

            whereClause = Object.assign(whereClause, newWhere);
        }

        if (to) {
            let newWhere = {
                from: LessThanOrEqual(to)
            };

            whereClause = Object.assign(whereClause, newWhere);
        }

        return (await this.calendarRepository.find({where: whereClause}))
            .map(cal => new EventInfoViewModel(
                cal.from,
                cal.to,
                cal.eventType
            ));
    }

    private static getEventType(typeId: number): EventType {
        if (typeId == EventType.REHEARSAL.valueOf()) {
            return EventType.REHEARSAL;
        }

        if (typeId == EventType.MEETING.valueOf()) {
            return EventType.MEETING;
        }

        if (typeId == EventType.PUBLIC_EVENT.valueOf()) {
            return EventType.PUBLIC_EVENT;
        }

        return EventType.SHOW;
    }

}
