import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const DIRECTUS_URL = process.env.DIRECTUS_URL;

export class DirectusService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async getItems<T>(collection: string, params: any = {}) : Promise<T> {
    try {
      const response = await axios.get(`${DIRECTUS_URL}/items/${collection}`, {
        ...(this.token ? { headers: { Authorization: `Bearer ${this.token}` } } : { }),
        params: {
          ...params,
          filter: params.filter ? JSON.stringify(params.filter) : void 0,
          aggregate: params.aggregate ? JSON.stringify(params.aggregate) : void 0,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error(`Error fetching items from ${collection}:`, error.message, error.response?.data || error);
      throw new Error(`Failed to fetch items from ${collection}`);
    }
  }

  async getTotalCount(collection: string, filter: any = {}) {
    try {
      const response = await axios.get(`${DIRECTUS_URL}/items/${collection}`, {
         ...(this.token ? { headers: { Authorization: `Bearer ${this.token}` } } : { }),
        params: {
          aggregate: { count: '*' },
          filter: filter ? JSON.stringify(filter) : void 0,
        },
      });
      return Number(response.data.data[0].count);
    } catch (error: any) {
      console.error(`Error fetching total count for ${collection}:`, error.message, error.response?.data || error);
      throw new Error(`Failed to fetch total count for ${collection}`);
    }
  }

  async updateItem(collection: string, id: number, data: any) {
    try {
      const response = await axios.patch(`${DIRECTUS_URL}/items/${collection}/${id}`, data, {
        ...(this.token ? { headers: { Authorization: `Bearer ${this.token}` } } : { }),
      });
      return response.data.data;
    } catch (error: any) {
      console.error(`Error updating item in ${collection}:`, error.message, error.response?.data || error);
      throw new Error(`Failed to update item in ${collection}`);
    }
  }
}