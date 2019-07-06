import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import { Container } from '../container';
import { UserController } from './controllers/user';
import { Controller } from './controllers/controller';

export class HttpServer {
  protected app: express.Application;

  constructor(container: Container) {
    const app = express();

    const middlewares = this.loadMiddlewares(container);

    const controllers = this.loadControllers(container);
    controllers.forEach((controller) => {
      const router = express.Router({ mergeParams: true });
      controller.register(router);
      app.use(router);
    });

    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.json({
      limit: process.env.BODY_LIMIT,
    }));
    this.app = app;
  }

  protected loadMiddlewares(container: Container): Middleware[] {
    
  }

  protected loadControllers(container: Container): Controller[] {
    return [
      new UserController(container),
    ];
  }
}
