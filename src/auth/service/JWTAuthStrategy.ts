import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {AuthService} from "./AuthService";
import {Injectable} from "@nestjs/common";
import {jwtConstants} from "../ConfigConstants";
import {JWTPayload} from "../payload/JWTPayload";
import {UserStrippedDTO} from "../payload/UserStrippedDTO";

@Injectable()
export class JWTAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: JWTPayload): Promise<UserStrippedDTO> {
        return new UserStrippedDTO(payload.sub, payload.username, payload.role, payload.theme);
    }
}
