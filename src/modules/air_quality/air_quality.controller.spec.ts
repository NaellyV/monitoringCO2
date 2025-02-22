import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from './air_quality.controller';
import { AirQualityService } from './air_quality.service';

describe('AirQualityController', () => {
  let controller: AirQualityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [AirQualityService],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
