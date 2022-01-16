import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field(() => String)
  name: string;

  @Field(() => Boolean, { nullable: true })
  isGood: boolean;

  @Field(() => Boolean)
  isVegan: boolean;

  @Field(() => String)
  address: string;

  @Field(() => String)
  ownersName: string;
}
