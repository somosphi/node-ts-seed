import { Router, Request, Response, NextFunction } from 'express';
import { Controller } from './controller';
import { Container } from '../../container';
import { UserService } from '../../container/services/user';

export class UserController extends Controller {
  protected userService: UserService;

  constructor(container: Container) {
    super();
    this.userService = container.userService;
  }

  register(router: Router): void {
    router.get('/', this.list.bind(this));
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.all();
      res.send(users);
    } catch (err) {
      next(err);
    }
  }
}
