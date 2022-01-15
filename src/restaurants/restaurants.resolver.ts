import { Args, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entity/restaurant.entity';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query(() => [Restaurant])
  restaurants(@Args('verganOnly') veganOnly: boolean): Restaurant[] {
    console.log('verganOnly=' + veganOnly);
    return [];
  }
}
