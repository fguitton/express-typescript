import {
    cleanEnv, port, str
} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        JWT_SECRET: str(),
        MONGO_URI: str(),
        PORT: port()
    });
}

export default validateEnv;
