import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean { // Context가 http로 되어있어서 GraphQL에서 사용하려면 변경이 필요
        const gqlContext = GqlExecutionContext.create(context).getContext(); // GraphQL Context로 변경
        const user = gqlContext['user'];
        if (!user) { // Contenxt에 유저 정보가 없을 경우
            return false;
        }
        return true; // Context에 유저 정보가 있을 경우
    }
}