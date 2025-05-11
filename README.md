markdown

# 🌬️ API de Monitoramento de Qualidade do Ar

## 📌 Visão Geral
API desenvolvida com NestJS para coleta e análise de dados de sensores ENS160 via ESP32, armazenando em PostgreSQL com Prisma ORM.

## 🚀 Rotas da API

### 📤 Envio de Dados
```http
POST /sensor

Payload:
json

{
  "media_eco2": 450,
  "location": "Sala A1"
}

📊 Consultas
Método	Endpoint	Descrição
GET	/sensor/media-diaria	Média diária de CO₂
GET	/sensor/media-semana	Média dos últimos 7 dias
GET	/sensor/ultima-leitura	Última medição registrada
GET	/sensor/historico	Últimas 10 leituras
GET	/sensor/grupo/:id	Medições do mesmo dia/local
GET	/sensor/grupo/:id/pdf	Relatório em PDF
📈 Classificação da Qualidade
CO₂ (ppm)	Classificação	Emoji
< 400	Excelente	🌿
400-800	Boa	👍
800-1000	Moderada	😷
1000-2000	Ruim	⚠️
2000-5000	Muito Ruim	❗
> 5000	Perigoso	☠️
🛠️ Configuração
Pré-requisitos

    Node.js 16+

    PostgreSQL

    npm/yarn

bash

# 1. Clone o repositório
git clone [URL_DO_REPOSITORIO]

# 2. Instale dependências
npm install

# 3. Configure o .env
cp .env.example .env

# 4. Execute migrações
npx prisma migrate dev

# 5. Inicie a aplicação
npm run start:dev

🗃️ Modelo de Dados
prisma

model Sensor {
  id          Int      @id @default(autoincrement())
  co2Level    Float
  airQuality  String
  location    String
  timestamp   DateTime @default(now())
  dayMedia    Float?
}

🔮 Roadmap

    Autenticação JWT

    Rate Limiting

    Dashboard em tempo real

    Sistema de alertas

    Testes automatizados

📄 Licença

MIT
