import { Router } from 'express';

export abstract class Controller {
  protected abstract register(router: Router): void;
}
