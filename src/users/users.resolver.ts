import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateAccountInput, createAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    /**
     * 유저 생성
     * @param createAccountInput 유저 생성 정보
     * @returns 생성 결과
     */
    @Mutation(() => createAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<createAccountOutput> {
        try {
            return this.usersService.createAccount(createAccountInput);
        } catch (e) {
            return { ok: false, error: e }
        }
    }

    /**
     * 로그인
     * @param loginInput 로그인 이메일, 패스워드 정보
     * @returns 로그인 처리 결과
     */
    @Mutation(() => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            return this.usersService.login(loginInput);
        } catch (e) {
            return { ok: false, error: e, token: '' }
        }
    }
}
