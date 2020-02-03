import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AuthGuard} from "@nestjs/passport";
import {Observable} from "rxjs";

@Injectable()
export class AppAuthGuard implements CanActivate {
    public constructor(private readonly reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const res = this.reflector.get<boolean>("isPublic", context.getHandler());
        if (!res) {
            return (new (AuthGuard('jwt'))()).canActivate(context);
        }

        return res;
    }
}
