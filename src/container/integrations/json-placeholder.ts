import { HttpIntegration } from './http';

export interface JsonPlaceholderConfig {
  baseURL: string;
}

export interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export class JsonPlaceholderIntegration extends HttpIntegration {

  constructor(options: JsonPlaceholderConfig) {
    super({
      baseURL: options.baseURL,
    });
  }

  async getUsers(): Promise<JsonPlaceholderUser[]>  {
    const response = await this.instance.get<JsonPlaceholderUser[]>('/users');
    return response.data;
  }
}
