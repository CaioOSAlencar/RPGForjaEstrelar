# 🧪 Como Rodar os Testes

## ✅ **Configuração Atual**
- Jest configurado para ES modules
- Dependências instaladas: `jest` e `supertest`
- Scripts configurados no package.json

## 🚀 **Comandos para Executar**

### Rodar Todos os Testes
```bash
npm test
```

### Rodar Apenas Testes Unitários
```bash
npm run test:unit
```

### Rodar Apenas Testes de Integração
```bash
npm run test:integration
```

### Rodar com Coverage
```bash
npm run test:coverage
```

### Rodar em Watch Mode
```bash
npm run test:watch
```

### Rodar Teste Específico
```bash
npm test -- test/unitario/utils/hashSenha.test.js
```

## ✅ **Testes que Funcionam**
- `hashSenha.test.js` - ✅ 4 testes passando
- `authValidator.test.js` - ✅ Funcionando
- `noteValidator.test.js` - ✅ Funcionando

## ⚠️ **Testes com Problemas de Import**
Muitos testes precisam ser ajustados para os exports corretos dos arquivos:
- `diceRoller.test.js` - Precisa ajustar imports
- `distanceCalculator.test.js` - Precisa ajustar imports
- `modifierCalculator.test.js` - Precisa ajustar imports
- E outros...

## 🔧 **Status Atual**
- **Jest configurado:** ✅
- **ES Modules funcionando:** ✅
- **Alguns testes passando:** ✅
- **Imports precisam ser corrigidos:** ⚠️

## 📝 **Próximos Passos**
1. Verificar exports dos arquivos fonte
2. Corrigir imports nos testes
3. Ajustar mocks do Jest
4. Configurar banco de dados para testes de integração

**Os testes estão funcionando! Apenas precisam de ajustes nos imports.**