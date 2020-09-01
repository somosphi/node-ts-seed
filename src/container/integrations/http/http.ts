import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { axiosLogger } from '../../../logger';

export abstract class HttpIntegration {
  protected instance: AxiosInstance;

  constructor(options: AxiosRequestConfig) {
    this.instance = axios.create(options);
    axiosLogger.attachInterceptor.bind(axiosLogger)(this.instance);
  }
}
