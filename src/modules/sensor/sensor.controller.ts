import { Controller, Post, Body, Get } from '@nestjs/common';

interface SensorData {
  status: number;
  media_eco2: number;
  qualidade: string;
  timestamp?: Date; 
}

@Controller('sensor')
export class SensorController {
  private historico: SensorData[] = [];

  @Post()
  async receberDados(@Body() dados: SensorData) {
    // Adiciona um timestamp aos dados recebidos
    const dadosComTimestamp = { ...dados, timestamp: new Date() };
    this.historico.push(dadosComTimestamp);

    console.log('Dados recebidos:', dadosComTimestamp);
    return { message: 'Dados armazenados', dados: dadosComTimestamp };
  }

  @Get('historico')
  getHistorico() {
    return this.historico;
  }

  @Get('media-diaria')
  getMediaDiaria() {
    const hoje = new Date();
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    // Filtra os dados do dia atual
    const dadosDoDia = this.historico.filter(dado => dado.timestamp && dado.timestamp >= inicioDoDia);

    if (dadosDoDia.length === 0) {
      return { message: 'Nenhum dado disponível para o dia atual' };
    }

    // Calcula a média do eCO2
    const totalECO2 = dadosDoDia.reduce((sum, dado) => sum + dado.media_eco2, 0);
    const mediaECO2 = totalECO2 / dadosDoDia.length;

    return {
      message: 'Média diária calculada',
      media_diaria_eco2: mediaECO2,
      total_de_leituras: dadosDoDia.length,
      dados: dadosDoDia,
    };
  }
}