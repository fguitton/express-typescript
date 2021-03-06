import { Router, Request, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import tagModel from '../tag/tag.model';
import userModel from './user.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private tag = tagModel;
  private user = userModel;

  constructor() {
      this.initializeRoutes();
  }

  private initializeRoutes() {
      this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
      this.router.get(`${this.path}/:id/tags`, authMiddleware, this.getAllTagsOfUser);
  }

  private getUserById = async (request: Request, response: Response, next: NextFunction) => {
      const id = request.params.id;
      const userQuery = this.user.findById(id);
      if (request.query.withTags === 'true') {
          userQuery.populate('tags').exec();
      }
      const user = await userQuery;
      if (user) {
          response.send(user);
      } else {
          next(new UserNotFoundException(id));
      }
  }

  private getAllTagsOfUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
      const userId = request.params.id;
      if (userId === request.user._id.toString()) {
          const tags = await this.tag.find({ author: userId });
          response.send(tags);
      }
      next(new NotAuthorizedException());
  }
}

export default UserController;
