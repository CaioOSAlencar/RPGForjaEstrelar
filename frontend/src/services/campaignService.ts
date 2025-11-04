import { api } from './api';

export interface Campaign {
  id: number;
  name: string;
  system: string;
  description?: string;
  masterId: number;
  roomCode: string;
  createdAt: string;
  master?: {
    name: string;
    email: string;
  };
}

export interface CreateCampaignData {
  name: string;
  system: string;
  description?: string;
}

export const campaignService = {
  async getAll(): Promise<Campaign[]> {
    const response = await api.get('/campaigns');
    return response.data.data;
  },

  async create(data: CreateCampaignData): Promise<Campaign> {
    console.log('Criando campanha:', data);
    try {
      const response = await api.post('/campaigns', data);
      console.log('Resposta da API:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Campaign> {
    const response = await api.get(`/campaigns/${id}`);
    return response.data.data;
  },

  async inviteByEmail(campaignId: number, email: string) {
    const response = await api.post(`/campaigns/${campaignId}/invite`, { email });
    return response.data.data;
  },

  async getShareableLink(campaignId: number) {
    const response = await api.get(`/campaigns/${campaignId}/share`);
    return response.data.data;
  },

  async joinByCode(roomCode: string) {
    const response = await api.post('/campaigns/join', { roomCode });
    return response.data.data;
  },

  async acceptInvite(token: string) {
    const response = await api.post(`/campaigns/invite/${token}/accept`);
    return response.data.data;
  },

  async getPlayers(campaignId: number) {
    const response = await api.get(`/campaigns/${campaignId}/players`);
    return response.data.data;
  },

  async removePlayer(campaignId: number, playerId: number) {
    const response = await api.delete(`/campaigns/${campaignId}/players/${playerId}`);
    return response.data;
  },

  async update(id: number, data: { name: string; description?: string; system: string }): Promise<Campaign> {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/campaigns/${id}`);
  }
};