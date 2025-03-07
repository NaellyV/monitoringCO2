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
      location: string;
    },
  ) {
    try {
      
      if (!dados.media_eco2 || !dados.location) {
        throw new Error('Dados incompletos: media_eco2 e location são obrigatórios.');
      }

     
      const determinarQualidade = (co2Level: number): string => {
        if (co2Level <= 1000) return 'Boa';
        if (co2Level <= 2000) return 'Moderada';
        return 'Ruim';
      };

      
      const qualidadeAr = determinarQualidade(dados.media_eco2);

      
      const sensorData = await this.prisma.sensor.create({
        data: {
          co2Level: dados.media_eco2,
          airQuality: qualidadeAr, 
          location: dados.location,
          dayMedia: dados.media_eco2,
        },
      });

      console.log('✅ Dados armazenados com sucesso:', sensorData);
      return { message: 'Dados armazenados', dados: sensorData };
    } catch (error) {
      console.error('❌ Erro ao armazenar os dados:', error.message);
      return { message: 'Erro ao armazenar os dados', error: error.message };
    }
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