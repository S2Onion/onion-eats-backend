import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAccountInput, createAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
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

    /**
     * 토큰에 있는 ID 값으로 유저 정보 조회
     * @param authUser 토큰에서 확인한 유저 정보 (데코레이터로 확인)
     * @returns 유저 정보
     */
    @Query(() => User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User): User {
        return authUser;
    }

    @Query(() => UserProfileOutput)
    @UseGuards(AuthGuard)
    async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        try {
            const user = await this.usersService.findById(userProfileInput.userId);
            if (!user) {
                throw Error();
            }
            return { ok: true, user: user };
        } catch (e) {
            console.error(e);
            return { ok: false, error: 'User Not Found' };
        }

    }
}
