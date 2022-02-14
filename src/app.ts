import express from 'express'
import cors from 'cors'
import logger from "./common/logger";
import http from 'http'
import mongoose from 'mongoose'
import bodyparser from 'body-parser';
import helmet from 'helmet';
import MainRoutes from './main.routes';
import coverage from './common/coverage';
import dotenv from 'dotenv';
dotenv.config();
const app: express.Application = express();
const server: http.Server = http.createServer(app);

logger.logger.info(
    mongoose.connect(`${process.env.MONGO_URL}`)
        .then(() => logger.logger.info(coverage.DB_MSG))
        .catch((e) => logger.logger.error(e))
)

app.use(express.static('public'));
app.use(bodyparser.json());
app.use(cors());
app.use(helmet());
app.set('view engine','ejs');

app.use("/app", MainRoutes.app);

server.listen(process.env.PORT, () => {
    logger.logger.info(coverage.SERVER_MSG + `${process.env.PORT}`);
}
)

