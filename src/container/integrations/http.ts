import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

export abstract class HttpIntegration {
  protected instance: AxiosInstance;

  constructor(options: AxiosRequestConfig) {
    this.instance = axios.create(options);
  }
}
