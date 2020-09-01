import 'dotenv/config';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import TagController from './tag/tag.controller';
import ReportController from './report/report.controller';
import UserController from './user/user.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
    [
        new TagController(),
        new AuthenticationController(),
        new UserController(),
        new ReportController()
    ]
);

app.listen();
