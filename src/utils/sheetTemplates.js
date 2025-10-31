// Templates de fichas por sistema de RPG

export const SHEET_TEMPLATES = {
  'D&D 5e': {
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    skills: {
      athletics: 0,
      acrobatics: 0,
      stealth: 0,
      investigation: 0,
      perception: 0,
      persuasion: 0
    },
    inventory: {
      weapons: [],
      armor: [],
      items: []
    }
  },
  'Tormenta20': {
    attributes: {
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      sabedoria: 10,
      carisma: 10
    },
    skills: {
      atletismo: 0,
      acrobacia: 0,
      furtividade: 0,
      investigacao: 0,
      percepcao: 0,
      diplomacia: 0
    },
    inventory: {
      armas: [],
      armaduras: [],
      itens: []
    }
  },
  'Call of Cthulhu': {
    attributes: {
      str: 50,
      dex: 50,
      int: 50,
      con: 50,
      app: 50,
      pow: 50,
      siz: 50,
      edu: 50
    },
    skills: {
      accounting: 10,
      anthropology: 1,
      archaeology: 1,
      art: 5,
      charm: 15,
      climb: 40,
      'credit_rating': 15,
      cthulhu_mythos: 0
    },
    inventory: {
      weapons: [],
      equipment: [],
      books: []
    }
  },
  'Cyberpunk RED': {
    attributes: {
      int: 6,
      ref: 6,
      dex: 6,
      tech: 6,
      cool: 6,
      will: 6,
      luck: 6,
      move: 6,
      body: 6,
      emp: 6
    },
    skills: {
      athletics: 2,
      brawling: 2,
      concentration: 2,
      conversation: 2,
      education: 2,
      evasion: 2,
      firearms: 2,
      local_expert: 2
    },
    inventory: {
      weapons: [],
      cyberware: [],
      gear: []
    }
  },
  'Custom': {
    attributes: {},
    skills: {},
    inventory: {}
  }
};

export const getTemplateForSystem = (systemName) => {
  return SHEET_TEMPLATES[systemName] || SHEET_TEMPLATES['Custom'];
};

export const getAvailableSystems = () => {
  return Object.keys(SHEET_TEMPLATES);
};