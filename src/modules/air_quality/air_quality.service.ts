import { Injectable } from '@nestjs/common';
import { CreateAirQualityDto } from './dto/create-air_quality.dto';
import { UpdateAirQualityDto } from './dto/update-air_quality.dto';

@Injectable()
export class AirQualityService {
  create(createAirQualityDto: CreateAirQualityDto) {
    return 'This action adds a new airQuality';
  }

  findAll() {
    return `This action returns all airQuality`;
  }

  findOne(id: number) {
    return `This action returns a #${id} airQuality`;
  }

  update(id: number, updateAirQualityDto: UpdateAirQualityDto) {
    return `This action updates a #${id} airQuality`;
  }

  remove(id: number) {
    return `This action removes a #${id} airQuality`;
  }
}
