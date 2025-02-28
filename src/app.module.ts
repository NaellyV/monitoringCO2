import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorController } from './modules/sensor/sensor.controller';

@Module({
  controllers: [AppController, SensorController],
  providers: [AppService],
})
export class AppModule {}
