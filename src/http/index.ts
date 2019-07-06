import express from 'express';
import { Container } from "../container";
import { UserController } from './controllers/user';

export class HttpServer {
  protected app: express.Application;

  constructor(container: Container) {
    const controllers = [
      new UserController(container),
    ];

    const app = express();
    controllers.forEach((controller) => {
      const router = express.Router({ mergeParams: true });
      controller.register(router);
      app.use(router);
    });

    this.app = app;
  }
}
