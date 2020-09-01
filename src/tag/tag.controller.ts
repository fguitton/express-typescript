import { Request, Response, NextFunction, Router } from 'express';
import TagNotFoundException from '../exceptions/TagNotFoundException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreateTagDto from './tag.dto';
import Tag from './tag.interface';
import tagModel from './tag.model';

class TagController implements Controller {
  public path = '/tags';
  public router = Router();
  private tag = tagModel;

  constructor() {
      this.initializeRoutes();
  }

  private initializeRoutes() {
      this.router.get(this.path, this.getAllTags);
      this.router.get(`${this.path}/:id`, this.getTagById);
      this.router
          .all(`${this.path}/*`, authMiddleware)
          .patch(`${this.path}/:id`, validationMiddleware(CreateTagDto, true), this.modifyTag)
          .delete(`${this.path}/:id`, this.deleteTag)
          .post(this.path, authMiddleware, validationMiddleware(CreateTagDto), this.createTag);
  }

  private getAllTags = async (request: Request, response: Response) => {
      const tags = await this.tag.find()
          .populate('author', '-password');
      response.send(tags);
  }

  private getTagById = async (request: Request, response: Response, next: NextFunction) => {
      const id = request.params.id;
      const tag = await this.tag.findById(id);
      if (tag) {
          response.send(tag);
      } else {
          next(new TagNotFoundException(id));
      }
  }

  private modifyTag = async (request: Request, response: Response, next: NextFunction) => {
      const id = request.params.id;
      const tagData: Tag = request.body;
      const tag = await this.tag.findByIdAndUpdate(id, tagData, { new: true });
      if (tag) {
          response.send(tag);
      } else {
          next(new TagNotFoundException(id));
      }
  }

  private createTag = async (request: RequestWithUser, response: Response) => {
      const tagData: CreateTagDto = request.body;
      const createdTag = new this.tag({
          ...tagData,
          author: request.user._id
      });
      const savedTag = await createdTag.save();
      await savedTag.populate('author', '-password').execPopulate();
      response.send(savedTag);
  }

  private deleteTag = async (request: Request, response: Response, next: NextFunction) => {
      const id = request.params.id;
      const successResponse = await this.tag.findByIdAndDelete(id);
      if (successResponse) {
          response.send(200);
      } else {
          next(new TagNotFoundException(id));
      }
  }
}

export default TagController;
