# 🎲 RPG FORJA ESTRELAR - BACKLOG DE DESENVOLVIMENTO

## 📊 STATUS GERAL
- **Total de Requisitos:** 45 funcionais + 12 não funcionais
- **Sprints Planejadas:** 8
- **Duração Estimada:** 8-12 semanas

---

## 🚀 SPRINT 1 - AUTENTICAÇÃO E USUÁRIOS
**Duração:** 1-2 semanas | **Status:** 🔄 Em Andamento

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF01 | Cadastro de usuário (nome, email, senha) | Alta | ⏳ Pendente | 4h |
| RF02 | Login com email e senha | Alta | ⏳ Pendente | 3h |
| RF03 | Token JWT com expiração de 7 dias | Alta | ⏳ Pendente | 2h |
| RF04 | Validar email único no cadastro | Alta | ⏳ Pendente | 1h |
| RF06 | Atribuir papel "player" automaticamente | Alta | ⏳ Pendente | 1h |
| RF05 | Editar nome e senha do usuário | Alta | ⏳ Pendente | 3h |

**Entregáveis:**
- ✅ Modelos User no Prisma
- ⏳ Controller de autenticação
- ⏳ Middleware JWT
- ⏳ Rotas de auth
- ⏳ Validações de entrada

---

## 🏰 SPRINT 2 - CAMPANHAS E CONVITES
**Duração:** 1-2 semanas | **Status:** ⏸️ Aguardando

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF07 | Criar campanha (nome, sistema, descrição) | Alta | ⏸️ Bloqueado | 4h |
| RF08 | Convites por email ou link compartilhável | Alta | ⏸️ Bloqueado | 6h |
| RF09 | Aceitar convite e entrar na campanha | Alta | ⏸️ Bloqueado | 4h |
| RF10 | Listar campanhas do usuário | Alta | ⏸️ Bloqueado | 3h |
| RF43 | Mestre remover jogadores da campanha | Alta | ⏸️ Bloqueado | 2h |

**Dependências:** Sprint 1 completa

---

## 🗺️ SPRINT 3 - MAPAS E CENAS BÁSICAS
**Duração:** 2 semanas | **Status:** ⏸️ Aguardando

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF11 | Criar cena com upload de imagem de fundo | Alta | ⏸️ Bloqueado | 6h |
| RF12 | Configurar grid (tamanho, cor, snap) | Alta | ⏸️ Bloqueado | 4h |
| RF13 | Upload de tokens (PNG/JPG) com nome e HP | Alta | ⏸️ Bloqueado | 5h |
| RF14 | Arrastar tokens em tempo real (WebSocket) | Alta | ⏸️ Bloqueado | 8h |
| RF15 | Rotacionar e redimensionar tokens | Alta | ⏸️ Bloqueado | 4h |
| RF34 | Salvar posição dos tokens em tempo real | Alta | ⏸️ Bloqueado | 3h |
| RF45 | Mestre deletar cenas e tokens | Alta | ⏸️ Bloqueado | 2h |

**Dependências:** Sprint 2 completa

---

## 💬 SPRINT 4 - CHAT E SISTEMA DE DADOS
**Duração:** 1-2 semanas | **Status:** ⏸️ Aguardando

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF23 | Chat em tempo real com timestamp | Alta | ⏸️ Bloqueado | 6h |
| RF20 | Rolagem de dados no chat (/roll 2d6+3) | Alta | ⏸️ Bloqueado | 5h |
| RF21 | Rolagens privadas (/w gm 1d20) | Alta | ⏸️ Bloqueado | 3h |
| RF22 | Histórico de rolagens com animação | Alta | ⏸️ Bloqueado | 4h |
| RF24 | Suporte a emotes (/me ataca) | Alta | ⏸️ Bloqueado | 2h |
| RF25 | Medir distância entre tokens | Alta | ⏸️ Bloqueado | 3h |

**Dependências:** Sprint 3 completa

---

## 📋 SPRINT 5 - FICHAS DE PERSONAGEM
**Duração:** 2 semanas | **Status:** ⏸️ Aguardando

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF18 | Criar ficha com atributos em JSON | Alta | ⏸️ Bloqueado | 8h |
| RF19 | Rolar dados da ficha (1d20 + FOR) | Alta | ⏸️ Bloqueado | 4h |
| RF16 | Vincular token à ficha de personagem | Alta | ⏸️ Bloqueado | 3h |
| RF17 | Barra de HP nos tokens em tempo real | Alta | ⏸️ Bloqueado | 4h |
| RF36 | Calcular modificadores automaticamente | Alta | ⏸️ Bloqueado | 5h |
| RF37 | Exibir condições nos tokens | Média | ⏸️ Bloqueado | 3h |
| RF44 | Mestre editar qualquer ficha | Alta | ⏸️ Bloqueado | 2h |

**Dependências:** Sprint 4 completa

---

## 🎨 SPRINT 6 - INTERFACE E UX
**Duração:** 1-2 semanas | **Status:** ⏸️ Aguardando

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF29 | Tema claro/escuro alternável | Alta | ⏸️ Bloqueado | 4h |
| RF30 | Interface responsiva (desktop/mobile) | Alta | ⏸️ Bloqueado | 8h |
| RF33 | Desenhar linhas e formas no mapa | Média | ⏸️ Bloqueado | 6h |
| RF35 | Salvar macros de rolagem na ficha | Média | ⏸️ Bloqueado | 4h |

---

## 📚 SPRINT 7 - JOURNAL E NARRATIVA
**Duração:** 1 semana | **Status:** ⏸️ Aguardando

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF38 | Criar notas com Markdown | Média | ⏸️ Bloqueado | 4h |
| RF39 | Enviar handouts aos jogadores | Média | ⏸️ Bloqueado | 3h |
| RF40 | Busca em notas e itens | Baixa | ⏸️ Bloqueado | 3h |

---

## 🎵 SPRINT 8 - MÍDIA E RECURSOS AVANÇADOS
**Duração:** 1-2 semanas | **Status:** ⏸️ Aguardando

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF28 | Upload e controle de música de fundo | Média | ⏸️ Bloqueado | 5h |
| RF41 | Playlist de músicas | Média | ⏸️ Bloqueado | 3h |
| RF42 | Efeitos sonoros rápidos | Baixa | ⏸️ Bloqueado | 4h |
| RF26 | Exportar campanha em JSON | Média | ⏸️ Bloqueado | 4h |
| RF27 | Importar campanha de JSON | Média | ⏸️ Bloqueado | 4h |
| RF31 | Fog of War com revelação gradual | Média | ⏸️ Bloqueado | 8h |
| RF32 | Visão limitada por token | Média | ⏸️ Bloqueado | 6h |

---

## ⚙️ REQUISITOS NÃO FUNCIONAIS

### 🔒 Segurança e Performance
| ID | Descrição | Status |
|----|-----------|--------|
| RNF03 | Criptografia bcrypt + HTTPS + JWT | ⏳ Em desenvolvimento |
| RNF04 | Resposta < 2 segundos | ⏳ Monitorar |
| RNF05 | Suporte a 10 usuários simultâneos | ⏳ Testar |

### 🛠️ Tecnologia
| ID | Descrição | Status |
|----|-----------|--------|
| RNF01 | Self-hosted sem internet | ✅ Arquitetura definida |
| RNF02 | SQLite como banco | ✅ Implementado |
| RNF07 | WebSocket (Socket.io) | ⏳ Pendente |
| RNF12 | Node.js + Express + React + Vite + Tailwind | ⏳ Pendente |

### 📱 Compatibilidade
| ID | Descrição | Status |
|----|-----------|--------|
| RNF06 | Chrome, Firefox, Edge, Safari | ⏳ Testar |
| RNF09 | PWA com modo offline | ⏸️ Futuro |

---

## 📈 MÉTRICAS DE PROGRESSO

### Por Sprint
- **Sprint 1:** 0/6 (0%) - 🔄 Atual
- **Sprint 2:** 0/5 (0%)
- **Sprint 3:** 0/7 (0%)
- **Sprint 4:** 0/6 (0%)
- **Sprint 5:** 0/7 (0%)
- **Sprint 6:** 0/4 (0%)
- **Sprint 7:** 0/3 (0%)
- **Sprint 8:** 0/8 (0%)

### Geral
- **Concluído:** 0/45 (0%)
- **Em Andamento:** 0/45 (0%)
- **Pendente:** 45/45 (100%)

---

## 🎯 PRÓXIMOS PASSOS

1. **Agora:** Implementar RF01 - Cadastro de usuário
2. **Depois:** RF02 - Login de usuário  
3. **Em seguida:** RF03 - Token JWT

**Comando para começar:**
```bash
npm install
npm run db:generate
npm run db:push
```

---

## 📝 NOTAS DE DESENVOLVIMENTO

- **Banco:** SQLite + Prisma configurado ✅
- **Estrutura:** Pastas criadas ✅
- **Dependências:** Definidas no package.json ✅
- **Próximo:** Implementar autenticação

**Última atualização:** $(date)