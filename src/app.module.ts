import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorController } from './sensor/sensor.controller';
import { AirQualityModule } from './modules/air_quality/air_quality.module';

@Module({
  imports: [AirQualityModule],
  controllers: [AppController, SensorController],
  providers: [AppService],
})
export class AppModule {}
