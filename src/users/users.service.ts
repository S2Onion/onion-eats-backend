import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    async createAccount({ email, password, role }: CreateAccountInput): Promise<string | undefined> {
        try {
            // Email 중복 확인
            const exists = await this.usersRepository.findOne({ email });
            if (exists) { // Email 정보가 DB에 있을 경우 에러 처리
                return 'There is a user with that email already';
            }

            // 계정 생성 및 비밀번호 암호화
            await this.usersRepository.save(this.usersRepository.create({ email, password, role }))
        } catch (e) {
            return 'Couldn\'t create account';
        }
    }
}
