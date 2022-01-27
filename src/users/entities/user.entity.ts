import { InternalServerErrorException } from "@nestjs/common";
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import * as bcrypt from 'bcrypt';
import { IsEmail, IsEnum } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";

enum UserRole {
    Owner,
    Client,
    Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {

    @IsEmail()
    @Field(type => String)
    @Column()
    email: string;

    @Field(type => String)
    @Column()
    password: string;

    @IsEnum(UserRole)
    @Field(type => UserRole)
    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException();
        }
    }
    
    async checkPassword(aPassword: string) : Promise<boolean> {
        try {
            return await bcrypt.compare(aPassword, this.password);
        } catch(e) {
            console.error(e);
            throw new InternalServerErrorException();       
        }
    }
}