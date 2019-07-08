import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import { Container } from '../container';
import { UserController } from './controllers/user';
import { Controller } from './controllers/controller';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import { NotFoundError } from '../errors';

export interface HttpServerConfig {
  port: number;
  bodyLimit: string;
}

export class HttpServer {
  protected app?: express.Application;
  protected container: Container;
  protected config: HttpServerConfig;

  constructor(container: Container, config: HttpServerConfig) {
    this.container = container;
    this.config = config;
  }

  get port(): number {
    return this.config.port;
  }

  protected loadControllers(): Controller[] {
    return [
      new UserController(this.container),
    ];
  }

  start(): void {
    if (this.app) {
      return;
    }

    /* Express initialization */
    const app = express();

    /* Express utilites */
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.json({
      limit: this.config.bodyLimit,
    }));

    /* Status endpoint */
    app.get(
      ['/info', '/status'],
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          res.sendStatus(204);
        } catch (err) {
          next(err);
        }
      },
    );

    this.loadControllers().forEach((controller) => {
      const router = express.Router({ mergeParams: true });
      controller.register(router);
      app.use(router);
    });

    app.use('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      next(new NotFoundError());
    });

    app.use(errorHandlerMiddleware);
    app.listen(this.config.port);

    this.app = app;
  }
}
