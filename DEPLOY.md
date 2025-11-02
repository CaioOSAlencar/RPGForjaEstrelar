# 🚀 Deploy na Vercel - 100% Gratuito

## 📋 Pré-requisitos

1. **Conta Supabase** (gratuita): https://supabase.com
2. **Conta Vercel** (gratuita): https://vercel.com
3. **Repositório no GitHub**

## 🗄️ 1. Configurar Supabase (Banco)

### Criar Projeto:
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Escolha nome e senha
4. Aguarde criação (~2 minutos)

### Executar SQL:
```sql
-- Criar tabelas
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'player',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  system VARCHAR(100) NOT NULL,
  description TEXT,
  master_id INTEGER REFERENCES users(id),
  room_code VARCHAR(10) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scenes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_id INTEGER REFERENCES campaigns(id),
  background_image VARCHAR(500),
  grid_size INTEGER DEFAULT 50,
  grid_color VARCHAR(7) DEFAULT '#ffffff',
  grid_opacity DECIMAL(3,2) DEFAULT 0.3,
  width INTEGER DEFAULT 1920,
  height INTEGER DEFAULT 1080,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Obter Credenciais:
- **URL**: Settings > API > Project URL
- **Key**: Settings > API > anon public

## 🚀 2. Deploy na Vercel

### Via GitHub:
1. Push código para GitHub
2. Acesse https://vercel.com
3. Clique "Import Project"
4. Selecione repositório
5. Configure variáveis:

```env
SUPABASE_URL=sua_url_aqui
SUPABASE_ANON_KEY=sua_key_aqui
JWT_SECRET=seu_jwt_secret_super_seguro
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app_gmail
```

### Deploy:
- Clique "Deploy"
- Aguarde build (~3 minutos)
- Pronto! 🎉

## 🔗 URLs Finais:
- **App**: https://seu-projeto.vercel.app
- **API**: https://seu-projeto.vercel.app/api

## 📱 Compartilhar com Amigos:
Envie o link: https://seu-projeto.vercel.app