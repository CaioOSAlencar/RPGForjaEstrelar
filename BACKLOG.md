# 🎲 RPG FORJA ESTRELAR - BACKLOG DE DESENVOLVIMENTO

## 📊 STATUS GERAL
- **Total de Requisitos:** 45 funcionais + 12 não funcionais
- **Sprints Planejadas:** 8
- **Duração Estimada:** 8-12 semanas

---

## ✅ SPRINT 1 - AUTENTICAÇÃO E USUÁRIOS
**Duração:** 1-2 semanas | **Status:** ✅ Completa

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF01 | Cadastro de usuário (nome, email, senha) | Alta | ✅ Concluído | 4h |
| RF02 | Login com email e senha | Alta | ✅ Concluído | 3h |
| RF03 | Token JWT com expiração de 7 dias | Alta | ✅ Concluído | 2h |
| RF04 | Validar email único no cadastro | Alta | ✅ Concluído | 1h |
| RF06 | Atribuir papel "player" automaticamente | Alta | ✅ Concluído | 1h |
| RF05 | Editar nome e senha do usuário | Alta | ✅ Concluído | 3h |

**Entregáveis:**
- ✅ Modelos User no Prisma
- ✅ Controller de autenticação
- ✅ Middleware JWT
- ✅ Rotas de auth
- ✅ Validações de entrada
- ✅ Documentação Swagger completa

---

## ✅ SPRINT 2 - CAMPANHAS E CONVITES
**Duração:** 1-2 semanas | **Status:** ✅ Completa

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF07 | Criar campanha (nome, sistema, descrição) | Alta | ✅ Concluído | 4h |
| RF08 | Convites por email ou link compartilhável | Alta | ✅ Concluído | 6h |
| RF09 | Aceitar convite e entrar na campanha | Alta | ✅ Concluído | 4h |
| RF10 | Listar campanhas do usuário | Alta | ✅ Concluído | 3h |
| RF43 | Mestre remover jogadores da campanha | Alta | ✅ Concluído | 2h |

**Entregáveis:**
- ✅ Modelos Campaign, CampaignUser, CampaignInvite no Prisma
- ✅ Controller de campanhas
- ✅ Sistema de convites completo
- ✅ Validações de campanha
- ✅ Documentação Swagger completa
- ✅ Gerenciamento de jogadores

---

## 🚀 SPRINT 3 - MAPAS E CENAS BÁSICAS
**Duração:** 2 semanas | **Status:** ✅ Completa

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF11 | Criar cena com upload de imagem de fundo | Alta | ✅ Concluído | 6h |
| RF12 | Configurar grid (tamanho, cor, snap) | Alta | ✅ Concluído | 4h |
| RF13 | Upload de tokens (PNG/JPG) com nome e HP | Alta | ✅ Concluído | 5h |
| RF14 | Arrastar tokens em tempo real (WebSocket) | Alta | ✅ Concluído | 8h |
| RF15 | Rotacionar e redimensionar tokens | Alta | ✅ Concluído | 4h |
| RF34 | Salvar posição dos tokens em tempo real | Alta | ✅ Concluído | 3h |
| RF45 | Mestre deletar cenas e tokens | Alta | ✅ Concluído | 2h |

**Entregáveis:**
- ✅ Modelos Scene, Token no Prisma
- ✅ Controller de cenas e tokens
- ✅ Sistema de upload de imagens
- ✅ WebSocket para tempo real
- ✅ Documentação Swagger completa

**Dependências:** Sprint 2 completa ✅

---

## 💬 SPRINT 4 - CHAT E SISTEMA DE DADOS
**Duração:** 1-2 semanas | **Status:** ✅ Completa

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF23 | Chat em tempo real com timestamp | Alta | ✅ Concluído | 6h |
| RF20 | Rolagem de dados no chat (/roll 2d6+3) | Alta | ✅ Concluído | 5h |
| RF21 | Rolagens privadas (/w gm 1d20) | Alta | ✅ Concluído | 3h |
| RF22 | Histórico de rolagens com animação | Alta | ✅ Concluído | 4h |
| RF24 | Suporte a emotes (/me ataca) | Alta | ✅ Concluído | 2h |
| RF25 | Medir distância entre tokens | Alta | ✅ Concluído | 3h |

**Dependências:** Sprint 3 completa

---

## ✅ SPRINT 5 - FICHAS DE PERSONAGEM
**Duração:** 2 semanas | **Status:** ✅ Completa

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF18 | Criar ficha com atributos em JSON | Alta | ✅ Concluído | 8h |
| RF19 | Rolar dados da ficha (1d20 + FOR) | Alta | ✅ Concluído | 4h |
| RF16 | Vincular token à ficha de personagem | Alta | ✅ Concluído | 3h |
| RF17 | Barra de HP nos tokens em tempo real | Alta | ✅ Concluído | 4h |
| RF36 | Calcular modificadores automaticamente | Alta | ✅ Concluído | 5h |
| RF37 | Exibir condições nos tokens | Média | ✅ Concluído | 3h |
| RF44 | Mestre editar qualquer ficha | Alta | ✅ Concluído | 2h |

**Dependências:** Sprint 4 completa

---

## 🎨 SPRINT 6 - INTERFACE E UX
**Duração:** 1-2 semanas | **Status:** ⏸️ Aguardando

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF29 | Tema claro/escuro alternável | Alta | ⏸️ Bloqueado | 4h |
| RF30 | Interface responsiva (desktop/mobile) | Alta | ⏸️ Bloqueado | 8h |
| RF33 | Desenhar linhas e formas no mapa | Média | ⏸️ Bloqueado | 6h |
| RF35 | Salvar macros de rolagem na ficha | Média | 🔄 Backend | 4h |

---

## 🔄 SPRINT 7 - JOURNAL E NARRATIVA
**Duração:** 1 semana | **Status:** 🔄 Backend Completo

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF38 | Criar notas com Markdown | Média | 🔄 Backend | 4h |
| RF39 | Enviar handouts aos jogadores | Média | 🔄 Backend | 3h |
| RF40 | Busca em notas e itens | Baixa | 🔄 Backend | 3h |

---

## 🔄 SPRINT 8 - MÍDIA E RECURSOS AVANÇADOS
**Duração:** 1-2 semanas | **Status:** 🔄 Backend Completo

| ID | Descrição | Prioridade | Status | Estimativa |
|----|-----------|------------|--------|------------|
| RF28 | Upload e controle de música de fundo | Média | 🔄 Backend | 5h |
| RF41 | Playlist de músicas | Média | 🔄 Backend | 3h |
| RF42 | Efeitos sonoros rápidos | Baixa | 🔄 Backend | 4h |
| RF26 | Exportar campanha em JSON | Média | 🔄 Backend | 4h |
| RF27 | Importar campanha de JSON | Média | 🔄 Backend | 4h |
| RF31 | Fog of War com revelação gradual | Média | ⏸️ Bloqueado | 8h |
| RF32 | Visão limitada por token | Média | ⏸️ Bloqueado | 6h |

---

## ⚙️ REQUISITOS NÃO FUNCIONAIS

### 🔒 Segurança e Performance
| ID | Descrição | Status |
|----|-----------|--------|
| RNF03 | Criptografia bcrypt + HTTPS + JWT | ✅ Implementado |
| RNF04 | Resposta < 2 segundos | ⏳ Monitorar |
| RNF05 | Suporte a 10 usuários simultâneos | ⏳ Testar |

### 🛠️ Tecnologia
| ID | Descrição | Status |
|----|-----------|--------|
| RNF01 | Self-hosted sem internet | ✅ Arquitetura definida |
| RNF02 | SQLite como banco | ✅ Implementado |
| RNF07 | WebSocket (Socket.io) | ✅ Implementado |
| RNF12 | Node.js + Express + React + Vite + Tailwind | ⏳ Pendente |

### 📱 Compatibilidade
| ID | Descrição | Status |
|----|-----------|--------|
| RNF06 | Chrome, Firefox, Edge, Safari | ⏳ Testar |
| RNF09 | PWA com modo offline | ⏸️ Futuro |

---

## 📈 MÉTRICAS DE PROGRESSO

### Por Sprint
- **Sprint 1:** 6/6 (100%) - ✅ Completa
- **Sprint 2:** 5/5 (100%) - ✅ Completa
- **Sprint 3:** 7/7 (100%) - ✅ Completa
- **Sprint 4:** 6/6 (100%) - ✅ Completa
- **Sprint 5:** 7/7 (100%) - ✅ Completa
- **Sprint 6:** 0/4 (0%) - RF35 movido para Sprint 7
- **Sprint 7:** 0/3 (0%) - Backend completo, aguardando frontend
- **Sprint 8:** 0/8 (0%) - Backend completo, aguardando frontend

### Geral
- **Concluído:** 31/45 (69%)
- **Em Andamento:** 0/45 (0%)
- **Backend Completo:** 9/45 (20%)
- **Pendente:** 10/45 (22%)

---

## 🎯 PRÓXIMOS PASSOS

1. **Agora:** Implementar frontend dos requisitos com backend pronto
2. **Depois:** RF31/RF32 - Fog of War e visão limitada (frontend)
3. **Em seguida:** Iniciar desenvolvimento do frontend React

**Comando para continuar:**
```bash
npm run dev
```

---

## 📝 NOTAS DE DESENVOLVIMENTO

- **Banco:** SQLite + Prisma configurado ✅
- **Autenticação:** Sistema completo implementado ✅
- **Campanhas:** Sistema completo com convites ✅
- **Swagger:** Documentação completa na raiz ✅
- **Arquitetura:** Camadas bem definidas ✅
- **Utils:** Helpers padronizados ✅
- **Próximo:** Sistema de mapas e tokens

**Última atualização:** Backend da Sprint 8 completo - RF28, RF41, RF42, RF26, RF27 (APIs prontas)

---

## 🏆 CONQUISTAS RECENTES

### Sprint 8 - Mídia e Recursos Avançados (Backend Completo)
- 🔄 **RF28** - API de música de fundo com controle (backend pronto)
- 🔄 **RF41** - API de playlist de músicas (backend pronto)
- 🔄 **RF42** - API de efeitos sonoros rápidos (backend pronto)
- 🔄 **RF26** - API de exportação de campanha em JSON (backend pronto)
- 🔄 **RF27** - API de importação de campanha de JSON (backend pronto)

### Sprint 7 - Journal e Narrativa (Backend Completo)
- 🔄 **RF38** - API de notas com Markdown (backend pronto)
- 🔄 **RF39** - API de handouts com permissões (backend pronto)
- 🔄 **RF40** - API de busca em notas (backend pronto)
- 🔄 **RF35** - API de macros de rolagem (backend pronto)

### Sprint 5 - Fichas de Personagem (100% Completa)
- ✅ **RF18** - Criar fichas com atributos em JSON
- ✅ **RF19** - Rolar dados da ficha com modificadores de atributos
- ✅ **RF16** - Vincular token à ficha de personagem
- ✅ **RF17** - Barra de HP nos tokens em tempo real
- ✅ **RF36** - Calcular modificadores automaticamente
- ✅ **RF37** - Exibir condições nos tokens
- ✅ **RF44** - Mestre editar qualquer ficha de personagem

### Sprint 4 - Chat e Sistema de Dados (100% Completa)
- ✅ **RF23** - Chat em tempo real com timestamp
- ✅ **RF20** - Rolagem de dados no chat (/roll 2d6+3)
- ✅ **RF21** - Rolagens privadas (/w gm 1d20)
- ✅ **RF22** - Histórico de rolagens com animação
- ✅ **RF24** - Suporte a emotes (/me ataca)
- ✅ **RF25** - Medir distância entre tokens

### Funcionalidades Implementadas
- 🔐 **Autenticação JWT** completa com validações rigorosas
- 🏰 **Gerenciamento de campanhas** robusto com convites e permissões
- 🗺️ **Sistema completo de cenas** com upload de mapas e grid configurável
- 🎭 **Sistema completo de tokens** com upload, CRUD e tempo real
- 💬 **Chat em tempo real** com dados, emotes e histórico
- 🎲 **Sistema de dados** com rolagens públicas/privadas e modificações
- 📋 **Fichas de personagem** flexíveis com JSON e cálculos automáticos
- 📊 **Barras de HP** e condições em tempo real nos tokens
- 📏 **Medição de distância** baseada no grid
- 📝 **APIs de notas** com Markdown e handouts (backend)
- 🔍 **API de busca** em notas e conteúdo (backend)
- 🎲 **API de macros** de rolagem nas fichas (backend)
- 🎵 **APIs de música** com controle e playlists (backend)
- 🔊 **API de efeitos sonoros** rápidos (backend)
- 📦 **APIs de import/export** de campanhas JSON (backend)
- ⚡ **WebSocket (Socket.io)** para sincronização em tempo real
- 📚 **Documentação Swagger** 100% completa e atualizada
- 🛠️ **Arquitetura limpa** com utils padronizados e validações