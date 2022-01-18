import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // GraphQL 사용
@Entity() // TypeORM 사용
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field(() => Float)
  id: number;

  @Field(() => String)
  @IsString()
  @Length(2, 10)
  @Column()
  name: string;

  @Field(() => Boolean, { defaultValue: true })
  @IsOptional()
  @IsBoolean()
  @Column({ default: true })
  isVegan: boolean;

  @Field(() => String)
  @IsString()
  @Column()
  address: string;

  @Field(() => String)
  @IsString()
  @Column()
  ownersName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  categoryName: string;
}
