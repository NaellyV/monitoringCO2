import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorController } from './modules/sensor/sensor.controller';
import { PrismaService } from './prisma.service'

@Module({
  controllers: [AppController, SensorController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
