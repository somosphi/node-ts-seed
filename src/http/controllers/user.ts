import { Request, Response, NextFunction } from 'express';
import { Container } from '../../container';
import { UserService } from '../../container/services/user';
import { findUserSchema, createUserSchema } from '../schemas/user';
import { validatorMiddleware } from '../middlewares/validator';
import { Controller, Get, Post } from '../decorators';
import { BaseController } from './controller';

@Controller('/users')
export class UserController extends BaseController {
  protected userService: UserService;

  constructor(container: Container) {
    super();
    this.userService = container.userService;
  }

  @Get('/')
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.all();
      res.send(users);
    } catch (err) {
      next(err);
    }
  }

  @Get('/:id', [validatorMiddleware(findUserSchema)])
  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(req.params.id);
      res.send(user);
    } catch (err) {
      next(err);
    }
  }

  @Post('/', [validatorMiddleware(createUserSchema)])
  async post(req: Request, res: Response, next: NextFunction) {
    const { name, username, emailAddress, source } = req.body;
    try {
      const id = await this.userService.create({
        name,
        username,
        emailAddress,
        source,
      });
      res.send({ id });
    } catch (err) {
      next(err);
    }
  }
}
