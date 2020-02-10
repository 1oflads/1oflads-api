import {
    Column,
    Entity,
    JoinColumn,
    OneToOne, PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import {Role} from "./Role";

@Entity()
export class RoleTheme {
    @PrimaryColumn()
    public id: number;

    @OneToOne(type => Role, role => role.theme)
    @JoinColumn({name: 'id'})
    public role: Role;

    @Column()
    public mainColor: string;

    @Column()
    public darkColor: string;

    @Column()
    public lightColor: string;
}
