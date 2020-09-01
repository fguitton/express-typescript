import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
      this.app = express();

      this.connectToTheDatabase();
      this.initializeMiddlewares();
      this.initializeControllers(controllers);
      this.initializeErrorHandling();
      this.initializeFallback();
  }

  public listen() {
      this.app.listen(process.env.PORT, () => {
          console.log(`App listening on the port ${process.env.PORT}`);
      });
  }

  public getServer() {
      return this.app;
  }

  private initializeMiddlewares() {
      this.app.use(bodyParser.json());
      this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
      this.app.use(errorMiddleware);
  }

  private initializeFallback() {
      this.app.all('/*', (__unused__req, res) => {
          res.status(400);
          res.json({status: 'Bad request'});
      });
  }

  private initializeControllers(controllers: Controller[]) {
      controllers.forEach((controller) => {
          this.app.use('/', controller.router);
      });
  }

  private connectToTheDatabase() {
      const { MONGO_URI } = process.env;
      mongoose.set('useNewUrlParser', true);
      mongoose.set('useFindAndModify', false);
      mongoose.set('useCreateIndex', true);
      mongoose.set('useUnifiedTopology', true);
      mongoose.connect(MONGO_URI);
  }
}

export default App;
