import { Controller, Post, Body, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('sensor')
export class SensorController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async receberDados(
    @Body() { status, media_eco2, location }: { status: number; media_eco2: number; location: string }
  ) {
    if (!media_eco2 || !location) {
      return { message: 'Dados incompletos: media_eco2 e location são obrigatórios.' };
    }

    const qualidadeAr = media_eco2 <= 1000 ? 'Boa' : media_eco2 <= 2000 ? 'Moderada' : 'Ruim';

    try {
      const sensorData = await this.prisma.sensor.create({
        data: { co2Level: media_eco2, airQuality: qualidadeAr, location, dayMedia: media_eco2 },
      });

      return { message: 'Dados armazenados', dados: sensorData };
    } catch (error) {
      return { message: 'Erro ao armazenar os dados', error: error.message };
    }
  }

  @Get('media-diaria')
  async getMediaDiaria() {
    const hoje = new Date();
    const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
    const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));

    const dadosDoDia = await this.prisma.sensor.findMany({
      where: { timestamp: { gte: inicioDoDia, lte: fimDoDia } },
    });

    const media = dadosDoDia.length ? dadosDoDia.reduce((acc, dado) => acc + dado.co2Level, 0) / dadosDoDia.length : 0;

    return { message: 'Média diária calculada', dados: { day: hoje.toLocaleDateString('pt-BR'), value: media } };
  }

  @Get('media-semana')
  async getMediaSemana() {
    const hoje = new Date();
    const inicioSemana = new Date(hoje.setDate(hoje.getDate() - 6));
    inicioSemana.setHours(0, 0, 0, 0);

    const dadosDaSemana = await this.prisma.sensor.findMany({ where: { timestamp: { gte: inicioSemana } } });

    const agrupadoPorDia = dadosDaSemana.reduce((acc, dado) => {
      const dia = new Date(dado.timestamp).toISOString().split('T')[0];
      acc[dia] = acc[dia] || { total: 0, count: 0 };
      acc[dia].total += dado.co2Level;
      acc[dia].count++;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const formattedData = Object.entries(agrupadoPorDia).map(([dia, { total, count }]) => {
      const diaSemana = new Date(dia).toLocaleDateString('pt-BR', { weekday: 'short' });
      return { day: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1), value: parseFloat((total / count).toFixed(2)) };
    });

    return { message: 'Média por dia nos últimos 7 dias', dados: formattedData };
  }

  @Get('ultima-leitura')
  async getUltimaLeitura() {
    const ultimaLeitura = await this.prisma.sensor.findFirst({ orderBy: { timestamp: 'desc' } });
    return ultimaLeitura ? { message: 'Última leitura encontrada', dados: ultimaLeitura } : { message: 'Nenhuma leitura disponível' };
  }
}
