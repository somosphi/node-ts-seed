import { Router } from 'express';

export abstract class Controller {
  abstract register(router: Router): void;
}
