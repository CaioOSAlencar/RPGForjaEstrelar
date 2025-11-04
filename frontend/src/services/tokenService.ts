import { api } from './api';

export interface Token {
  id: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  campaignId: string;
}

export interface MapToken {
  id: string;
  tokenId?: string;
  sceneId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  hp: number;
  maxHp: number;
  conditions: string[];
  visible: boolean;
  name?: string;
  imageUrl?: string;
  token?: Token;
}

export const tokenService = {
  async getTokens(campaignId: string): Promise<Token[]> {
    const response = await api.get('/tokens/my-tokens');
    const tokens = response.data.data || response.data || [];
    return tokens.filter((token: Token) => token.campaignId === campaignId);
  },

  async uploadToken(campaignId: string, file: File, sceneId?: string): Promise<Token> {
    const formData = new FormData();
    formData.append('tokenImage', file); // Campo correto esperado pelo backend
    formData.append('name', file.name.split('.')[0]);
    
    if (sceneId) {
      formData.append('sceneId', sceneId);
    } else {
      formData.append('sceneId', '1');
    }
    
    const response = await api.post('/tokens', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  async deleteToken(tokenId: string): Promise<void> {
    await api.delete(`/tokens/${tokenId}`);
  },

  async getMapTokens(sceneId: string): Promise<MapToken[]> {
    const response = await api.get(`/scenes/${sceneId}/tokens`);
    return response.data;
  },

  async addTokenToMap(sceneId: string, tokenId: string, x: number, y: number): Promise<MapToken> {
    const response = await api.post(`/scenes/${sceneId}/tokens`, {
      tokenId,
      x,
      y
    });
    return response.data.data;
  },

  async updateMapToken(mapTokenId: string, updates: Partial<MapToken>): Promise<MapToken> {
    const response = await api.put(`/map-tokens/${mapTokenId}`, updates);
    return response.data;
  },

  async deleteMapToken(mapTokenId: string): Promise<void> {
    await api.delete(`/map-tokens/${mapTokenId}`);
  }
};