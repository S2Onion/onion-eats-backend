import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entity/restaurant.entity';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])], // 현재 범위에 등록된 저장소를 정의
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}
