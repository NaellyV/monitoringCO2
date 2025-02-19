import { Controller, Post, Body, Get } from '@nestjs/common';

interface SensorData {
  status: number;
  media_eco2: number;
  qualidade: string;
}

@Controller('sensor')
export class SensorController {
  private historico: SensorData[] = [];

  @Post()
  async receberDados(@Body() dados: SensorData) {
    this.historico.push(dados);

    console.log('Dados recebidos:', dados);
    return { message: 'Dados armazenados', dados };
  }

  @Get('historico')
  getHistorico() {
    return this.historico;
  }
}
