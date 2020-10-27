import { UserSources } from './enums';
import { HomeVHost } from './amqp/vhosts/home';
import { WorkVHost } from './amqp/vhosts/work';

export interface FindUserMessage {
  id: string;
}

export interface RabbitMQConfig {
  protocol: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface UserMessage {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
}

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

export interface User {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
  source: UserSources;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContainerConfig {
  homeVHost: HomeVHost;
  workVHost: WorkVHost;
}

export interface WorkerJob {
  running: boolean;
  start(): void;
  stop(): void;
}
