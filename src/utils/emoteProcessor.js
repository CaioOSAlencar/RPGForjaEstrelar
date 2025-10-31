// RF24 - Sistema de emotes no chat

// Verificar se é comando de emote
export const isEmoteCommand = (content) => {
  return /^\/me\s+.+$/i.test(content.trim());
};

// Processar comando de emote
export const processEmoteCommand = (content, userName) => {
  if (!isEmoteCommand(content)) {
    return null;
  }
  
  // Remove /me e espaços extras
  const emoteText = content.replace(/^\/me\s+/i, '').trim();
  
  if (!emoteText) {
    throw new Error('Comando /me requer uma ação. Exemplo: /me ataca com fúria');
  }
  
  // Formatar como emote: *NomeUsuário ação*
  const formattedEmote = `*${userName} ${emoteText}*`;
  
  return {
    originalContent: content,
    emoteText: emoteText,
    formattedContent: formattedEmote,
    isEmote: true
  };
};