import { provide } from 'injection';
import { HttpIntegration } from './http';
import { env } from '../../../env';
import { JsonPlaceholderUser } from '../../../types';

@provide()
export class JsonPlaceholderIntegration extends HttpIntegration {
  constructor() {
    super({
      baseURL: env.jsonPlaceholderUrl,
    });
  }

  async getUsers(): Promise<JsonPlaceholderUser[]> {
    const response = await this.instance.get<JsonPlaceholderUser[]>('/users');
    return response.data;
  }
}
