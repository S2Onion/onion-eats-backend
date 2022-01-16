import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './entity/restaurant.entity';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query(() => [Restaurant])
  restaurants(@Args('verganOnly') veganOnly: boolean): Restaurant[] {
    console.log('verganOnly=' + veganOnly);
    return [];
  }

  @Mutation(() => Boolean)
  createRestaurant(@Args() createData: CreateRestaurantDto): boolean {
    console.log('creatData' + createData);
    return true;
  }
}
