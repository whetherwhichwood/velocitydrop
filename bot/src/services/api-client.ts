import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createServer(discordId: string, name: string, gameType: string) {
    const response = await this.client.post('/api/servers', {
      discordId,
      name,
      gameType,
    });
    return response.data;
  }

  async listServers(discordId: string) {
    const response = await this.client.get('/api/servers', {
      params: { discordId },
    });
    return response.data;
  }

  async startServer(discordId: string, serverId: string) {
    const response = await this.client.post(`/api/servers/${serverId}/start`, {
      discordId,
    });
    return response.data;
  }

  async stopServer(discordId: string, serverId: string) {
    const response = await this.client.post(`/api/servers/${serverId}/stop`, {
      discordId,
    });
    return response.data;
  }

  async getServerStatus(discordId: string, serverId: string) {
    const response = await this.client.get(`/api/servers/${serverId}/status`, {
      params: { discordId },
    });
    return response.data;
  }

  async getTokenBalance(discordId: string) {
    const response = await this.client.get('/api/tokens/balance', {
      params: { discordId },
    });
    return response.data;
  }

  async addTokens(discordId: string, amount: number, description?: string) {
    const response = await this.client.post('/api/admin/tokens', {
      discordId,
      amount,
      description,
    });
    return response.data;
  }

  async listAllServers() {
    const response = await this.client.get('/api/admin/servers');
    return response.data;
  }

  async getResourceStatus() {
    const response = await this.client.get('/api/admin/resources');
    return response.data;
  }
}

export const apiClient = new ApiClient();

