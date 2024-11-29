import asyncHandler from 'express-async-handler';
import { SuccessMsgResponse } from '../services/response-service';

class HealthController {
  checkServerHealth = asyncHandler(async (_req, res) => {
    new SuccessMsgResponse('The API is up and running. Health check is passed.').send(res);
  });
}

export default new HealthController();
