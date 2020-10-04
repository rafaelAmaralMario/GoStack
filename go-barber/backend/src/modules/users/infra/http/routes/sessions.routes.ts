import { Router } from 'express';

import SessionControllers from '@modules/users/infra/http/controllers/SessionControllers';

const sessionsRouter = Router();
const sessionControllers = new SessionControllers();

sessionsRouter.post('/', sessionControllers.create);

export default sessionsRouter;
