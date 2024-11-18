import { Router } from 'express';
import * as RequestHandler from '../requestHandlers';

export const TestRouter = Router();

const TestController = {
    deleteAllData: RequestHandler.deleteAllDataHandler,
};

TestRouter.delete('/', TestController.deleteAllData);
