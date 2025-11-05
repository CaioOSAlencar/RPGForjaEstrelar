import { api } from './api';

export interface Scene {
  id: string;
  name: string;
  description?: string;
  backgroundUrl?: string;
  gridSize: number;
  gridColor: string;
  gridOpacity: number;
  width: number;
  height: number;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSceneData {
  name: string;
  description?: string;
  campaignId: string;
  gridSize?: number;
  gridColor?: string;
  gridOpacity?: number;
  width?: number;
  height?: number;
}

export const sceneService = {
  async getScenes(campaignId: string): Promise<Scene[]> {
    const response = await api.get(`/scenes/campaign/${campaignId}`);
    return response.data.data || response.data;
  },

  async getScene(sceneId: string): Promise<Scene> {
    const response = await api.get(`/scenes/${sceneId}`);
    const scene = response.data.data || response.data;
    if (!scene || !scene.id) {
      throw new Error('Cena nao encontrada');
    }
    return scene;
  },

  async createScene(data: CreateSceneData): Promise<Scene> {
    const response = await api.post('/scenes', data);
    return response.data;
  },

  async updateScene(sceneId: string, data: Partial<CreateSceneData>): Promise<Scene> {
    const response = await api.put(`/scenes/${sceneId}`, data);
    return response.data.data || response.data;
  },

  async deleteScene(sceneId: string): Promise<void> {
    await api.delete(`/scenes/${sceneId}`);
  },

  async uploadBackground(sceneId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('backgroundImage', file);
    const response = await api.put(`/scenes/${sceneId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data?.backgroundUrl || response.data.backgroundUrl;
  }
};