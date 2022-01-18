import { InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entity/restaurant.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ['id'], InputType) {

}
