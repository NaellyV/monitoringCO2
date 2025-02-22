import { Module } from '@nestjs/common';
import { AirQualityService } from './air_quality.service';
import { AirQualityController } from './air_quality.controller';

@Module({
  controllers: [AirQualityController],
  providers: [AirQualityService],
})
export class AirQualityModule {}
