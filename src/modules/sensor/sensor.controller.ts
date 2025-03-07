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
  const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
  const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));

  const dadosDoDia = await this.prisma.sensor.findMany({
    where: {
      timestamp: {
        gte: inicioDoDia,
        lte: fimDoDia,
      },
    },
  });

  const total = dadosDoDia.reduce((acc, dado) => acc + dado.co2Level, 0);
  const media = dadosDoDia.length ? total / dadosDoDia.length : 0;

  return {
    message: 'Média diária calculada',
    dados: { day: hoje.toLocaleDateString('pt-BR'), value: media },
  };
}

@Get('media-semana')
async getMediaSemana() {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - 6);
  inicioSemana.setHours(0, 0, 0, 0);

  const dadosDaSemana = await this.prisma.sensor.findMany({
    where: {
      timestamp: {
        gte: inicioSemana,
      },
    },
  });
  console.log("Dados brutos da semana:", dadosDaSemana);

  const agrupadoPorDia = dadosDaSemana.reduce((acc, dado) => {
    const dia = new Date(dado.timestamp).toLocaleDateString('pt-BR');

    if (!acc[dia]) {
      acc[dia] = { total: 0, count: 0 };
    }

    acc[dia].total += dado.co2Level;
    acc[dia].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const formattedData = Object.keys(agrupadoPorDia).map((dia) => {
    const data = new Date(dia); 
    const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "short" }); 
    
    const media = agrupadoPorDia[dia].total / agrupadoPorDia[dia].count;
    
    return {
      day: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1).replace(".", ""), 
      value: parseFloat(media.toFixed(2)), 
    };
  });
  

  return {
    message: 'Média por dia nos últimos 7 dias',
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