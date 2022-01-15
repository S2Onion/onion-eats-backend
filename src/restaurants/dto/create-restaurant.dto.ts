import { ArgsType, Field, InputType } from '@nestjs/graphql';

//@InputType()
@ArgsType()
export class CreateRestaurantDto {
  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  isGood: boolean;

  @Field(() => Boolean)
  isVegan: boolean;

  @Field(() => String)
  address: string;

  @Field(() => String)
  ownersName: string;
}
