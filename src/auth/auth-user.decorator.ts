import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const gqlContext = GqlExecutionContext.create(context).getContext(); // GraphQL Context로 변경
        const user = gqlContext['user']; // Context에서 User 정보를 가져와서 리턴
        return user;
    }
);