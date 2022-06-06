import express, {Express, Request, Response} from 'express';
import morgan from 'morgan'
import cors from 'cors'
import {env} from "./env";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan(env.loggingFormat));
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.json({title: 'Server-Based Verifiable Data Registry'});
});

app.listen(env.port, () => {
    console.log(`️Running on port ${env.port}`);
});
