// src/modules/sensor/sensor.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('sensor')
export class SensorController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async receberDados(
    @Body()
    dados: {
      status: number;
      media_eco2: number;
      qualidade: string;
      location: string;
    },
  ) {
    const sensorData = await this.prisma.sensor.create({
      data: {
        co2Level: dados.media_eco2,
        airQuality: dados.qualidade,
        location: dados.location,
        dayMedia: dados.media_eco2,
      },
    });

    console.log('Dados recebidos e armazenados:', sensorData);
    return { message: 'Dados armazenados', dados: sensorData };
  }

  @Get('media-diaria')
  async getMediaDiaria() {
    const hoje = new Date();
    const inicioDoDia = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate(),
    );

    // Busca os dados do dia atual
    const dadosDoDia = await this.prisma.sensor.findMany({
      where: {
        timestamp: {
          gte: inicioDoDia,
        },
      },
    });

    if (dadosDoDia.length === 0) {
      return { message: 'Nenhum dado disponível para o dia atual' };
    }

    // Calcula a média do eCO2
    const totalECO2 = dadosDoDia.reduce((sum, dado) => sum + dado.co2Level, 0);
    const mediaECO2 = totalECO2 / dadosDoDia.length;

    // Atualiza a média diária no banco de dados
    await this.prisma.sensor.updateMany({
      where: {
        timestamp: {
          gte: inicioDoDia,
        },
      },
      data: {
        dayMedia: mediaECO2,
      },
    });

    return {
      message: 'Média diária calculada',
      media_diaria_eco2: mediaECO2,
      total_de_leituras: dadosDoDia.length,
      dados: dadosDoDia,
    };
  }
}