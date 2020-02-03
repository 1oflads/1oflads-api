import {createParamDecorator, SetMetadata} from "@nestjs/common";

export const AuthPrincipal = createParamDecorator((_, req) => req.user);

export const Public = () => SetMetadata( "isPublic", true );
