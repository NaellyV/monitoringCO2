import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AirQualityService } from './air_quality.service';
import { CreateAirQualityDto } from './dto/create-air_quality.dto';
import { UpdateAirQualityDto } from './dto/update-air_quality.dto';

@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Post()
  create(@Body() createAirQualityDto: CreateAirQualityDto) {
    return this.airQualityService.create(createAirQualityDto);
  }

  @Get()
  findAll() {
    return this.airQualityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airQualityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAirQualityDto: UpdateAirQualityDto) {
    return this.airQualityService.update(+id, updateAirQualityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airQualityService.remove(+id);
  }
}
