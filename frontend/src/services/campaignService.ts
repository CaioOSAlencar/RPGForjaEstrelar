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
    const response = await api.post('/campaigns', data);
    return response.data.data;
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
  }
};