import { PartialType } from '@nestjs/mapped-types';
import { CreateAirQualityDto } from './create-air_quality.dto';

export class UpdateAirQualityDto extends PartialType(CreateAirQualityDto) {}
