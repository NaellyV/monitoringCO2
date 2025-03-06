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
  const inicioDaSemana = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate() - hoje.getDay(), 
  );

  const dadosDaSemana = await this.prisma.sensor.findMany({
    where: {
      timestamp: {
        gte: inicioDaSemana, 
      },
    },
  });

  const mediaPorDia = dadosDaSemana.reduce((acc, dado) => {
    const diaSemana = new Date(dado.timestamp).toLocaleDateString('pt-BR', {
      weekday: 'short', 
    });

    if (!acc[diaSemana]) {
      acc[diaSemana] = { total: 0, count: 0 };
    }

    acc[diaSemana].total += dado.co2Level;
    acc[diaSemana].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const formattedData = diasDaSemana.map((dia) => ({
    day: dia,
    value: mediaPorDia[dia] ? mediaPorDia[dia].total / mediaPorDia[dia].count : 0, 
  }));

  return {
    message: 'Média semanal calculada',
    dados: formattedData,
  };
  }

  @Get('ultima-leitura')
  async getUltimaLeitura() {
    console.log('Endpoint /ultima-leitura chamado'); 
    const ultimaLeitura = await this.prisma.sensor.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!ultimaLeitura) {
      console.log('Nenhuma leitura disponível'); 
      return { message: 'Nenhuma leitura disponível' };
    }

    console.log('Última leitura encontrada:', ultimaLeitura); 
    return {
      message: 'Última leitura encontrada',
      dados: ultimaLeitura,
    };
  }
}