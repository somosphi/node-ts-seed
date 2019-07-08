import { Router, Request, Response, NextFunction } from 'express';
import { Controller } from './controller';
import { Container } from '../../container';
import { UserService } from '../../container/services/user';
import { findUserSchema } from '../schemas/user';
import { validatorMiddleware } from '../middlewares/validator';

export class UserController extends Controller {
  protected userService: UserService;

  constructor(container: Container) {
    super();
    this.userService = container.userService;
  }

  register(router: Router): void {
    router.get('/users', this.list.bind(this));
    router.get('/users/:id', validatorMiddleware(findUserSchema), this.find.bind(this));
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.all();
      res.send(users);
    } catch (err) {
      next(err);
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(req.params.id);
      res.send(user);
    } catch (err) {
      next(err);
    }
  }
}
