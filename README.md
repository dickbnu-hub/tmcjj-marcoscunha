# TMC-MarcosCunha — Site Institucional

Site da academia de Jiu-Jitsu **TMC-MarcosCunha**, com agendamento de aula experimental, painel admin e chat FAQ.

---

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Prisma** + **SQLite** (dev) — pronto para trocar por Postgres/Supabase em produção
- **iron-session** para autenticação do admin
- **WhatsApp**: Cloud API da Meta (+ fallback via link `wa.me`)

---

## Como instalar e rodar

```bash
# 1. Instalar dependências
npm install

# 2. Criar o banco e gerar o client Prisma
npx prisma db push

# 3. Popular o banco com dados de exemplo
npx tsx prisma/seed.ts

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse em **http://localhost:3000**

---

## Acesso ao painel admin

URL: **http://localhost:3000/admin**

Credenciais padrão (definidas em `.env.local`):

| Campo    | Valor    |
|----------|----------|
| Usuário  | `admin`  |
| Senha    | `tmc2026`|

> **Em produção**, troque `ADMIN_USERNAME` e `ADMIN_PASSWORD` no arquivo de variáveis de ambiente da Vercel.

---

## Configurar o WhatsApp Business

Quando você tiver sua conta do **WhatsApp Business Cloud API** (Meta), preencha em `.env.local`:

```env
WHATSAPP_API_TOKEN="seu-token-aqui"
WHATSAPP_PHONE_ID="seu-phone-id-aqui"
```

Sem essas credenciais, o sistema funciona em **modo fallback**: a mensagem é logada no console do servidor e um link `wa.me/...` é retornado na resposta da API para envio manual.

### Como obter as credenciais Meta:
1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie um App → tipo "Business"
3. Adicione o produto "WhatsApp"
4. Em "WhatsApp > API Setup", copie o **Phone number ID** e gere um **Token de acesso**
5. Configure um número de telefone real (ou use o número de teste da Meta)

---

## Como substituir os placeholders

### Fotos dos professores
Substitua os arquivos em `public/professores/`:
- `marcos-cunha.jpg` → foto do Marcos Cunha
- `placeholder.jpg` → foto genérica (usada pelos demais professores)

Ou adicione fotos individuais e atualize o campo `foto` em `data/professores.ts`.

### Fotos dos treinos (carrossel)
Substitua os arquivos em `public/treinos/`:
- `treino-01.jpg` a `treino-05.jpg`

Adicione mais slides editando o array `SLIDES` em `src/components/Carrossel.tsx`.

### Dados que precisam de substituição

Pesquise por `[` no projeto para encontrar todos os placeholders:

| Placeholder | Onde | O que colocar |
|---|---|---|
| `[VALOR_PLANO_MENSAL]` | `data/professores.ts` | Valor do plano mensal |
| `[VALOR_PLANO_SEMESTRAL]` | `data/professores.ts` | Valor do plano semestral |
| `[VALOR_PLANO_ANUAL]` | `data/professores.ts` | Valor do plano anual |
| `[VALOR_MATRICULA]` | `data/professores.ts` | Taxa de matrícula |
| `[GOOGLE_MAPS_EMBED_URL]` | `data/professores.ts` | URL do embed do Maps |
| `[INSTAGRAM_URL]` | `data/professores.ts` | Link do Instagram |
| `[FACEBOOK_URL]` | `data/professores.ts` | Link do Facebook |

### Professores adicionais
Edite `data/professores.ts` para atualizar nome, apelido, faixa/grau e WhatsApp dos professores placeholder (Rodrigo, Carla, Felipe).

Os mesmos dados em `data/professores.ts` são a **fonte única** usada pelo cronograma, formulário de agendamento, chat e rodapé.

---

## Turmas e horários

Edite `data/turmas.ts` para ajustar dias, horários, vagas e professores.  
Rode `npx tsx prisma/seed.ts` novamente para re-sincronizar o banco.

---

## Deploy na Vercel

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

Configure as variáveis de ambiente na dashboard da Vercel:
- `DATABASE_URL` → string de conexão Postgres (ex.: Neon, Supabase, PlanetScale)
- `SESSION_SECRET` → string aleatória longa (ex.: `openssl rand -base64 32`)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- `WHATSAPP_API_TOKEN` / `WHATSAPP_PHONE_ID` (quando disponíveis)

Para trocar SQLite por Postgres, mude em `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // era "sqlite"
  url      = env("DATABASE_URL")
}
```

---

## Estrutura de pastas

```
├── data/
│   ├── turmas.ts        ← fonte única de turmas/horários
│   └── professores.ts   ← fonte única de professores, valores, endereço
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── professores/     ← substitua pelos JPGs reais
│   └── treinos/         ← substitua pelos JPGs reais
└── src/
    ├── app/
    │   ├── page.tsx             ← landing page
    │   ├── admin/               ← painel admin (protegido)
    │   └── api/                 ← rotas de API
    ├── components/              ← todos os componentes da landing
    └── lib/
        ├── prisma.ts            ← client singleton
        ├── session.ts           ← iron-session
        └── whatsapp.ts          ← envio WhatsApp + fallback
```
