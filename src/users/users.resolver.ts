import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Mutation(() => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const {ok, error} = await this.usersService.createAccount(createAccountInput);
            return {
                ok,
                error
            }
        } catch (e) {
            return {
                ok: false,
                error: e
            }
        }
    }
}
