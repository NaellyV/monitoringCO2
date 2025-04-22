import { Controller, Post, Body, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('sensor')
export class SensorController {
  constructor(private prisma: PrismaService) {}

  private classificarQualidadeAr(eco2: number): string {
    if (eco2 < 400) return "Excelente";
    if (eco2 < 800) return "Boa";
    if (eco2 < 1000) return "Moderada";
    if (eco2 < 2000) return "Ruim";
    if (eco2 < 5000) return "Muito Ruim";
    return "Perigoso";
  }

  @Post()
  async receberDados(
    @Body() { media_eco2, location }: { media_eco2: number; location: string }
  ) {
    if (!media_eco2 || !location) {
      return { message: 'Dados incompletos: media_eco2 e location são obrigatórios.' };
    }

    const qualidadeAr = this.classificarQualidadeAr(media_eco2);

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
    const agora = new Date();
    const inicioSemana = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate() - 6, 0, 0, 0, 0));
    const fimSemana = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate(), 23, 59, 59, 999));

    const dadosDaSemana = await this.prisma.sensor.findMany({
      where: { timestamp: { gte: inicioSemana, lte: fimSemana } },
    });

    const agrupadoPorDia: Record<string, { total: number; count: number }> = {};

    for (let i = 0; i < 7; i++) {
      const data = new Date(inicioSemana);
      data.setUTCDate(inicioSemana.getUTCDate() + i);
      const diaFormatado = data.toISOString().split('T')[0];
      agrupadoPorDia[diaFormatado] = { total: 0, count: 0 };
    }

    for (const dado of dadosDaSemana) {
      const dataLeitura = new Date(dado.timestamp);
      const dia = dataLeitura.toISOString().split('T')[0];

      if (agrupadoPorDia[dia]) {
        agrupadoPorDia[dia].total += dado.co2Level;
        agrupadoPorDia[dia].count++;
      }
    }

    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

    const formattedData = Object.entries(agrupadoPorDia).map(([dia, { total, count }]) => {
      const data = new Date(dia);
      return {
        day: diasSemana[data.getUTCDay()],
        value: count > 0 ? parseFloat((total / count).toFixed(2)) : 0,
      };
    });

    return { message: 'Média dos últimos 7 dias', dados: formattedData };
  }

  @Get('ultima-leitura')
  async getUltimaLeitura() {
    const ultimaLeitura = await this.prisma.sensor.findFirst({ orderBy: { timestamp: 'desc' } });
    return ultimaLeitura ? { message: 'Última leitura encontrada', dados: ultimaLeitura } : { message: 'Nenhuma leitura disponível' };
  }

  @Get("historico")
  async getHistorico(){
    const historico = await this.prisma.sensor.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    return historico.length ? { message: 'Histórico encontrado', dados: historico } : { message: 'Nenhum dado encontrado' };
  }
}
