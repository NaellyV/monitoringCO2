import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [SensorController], 
  providers: [PrismaService], 
})
export class SensorModule {}