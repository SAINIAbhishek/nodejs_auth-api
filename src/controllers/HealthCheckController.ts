import asyncHandler from 'express-async-handler';
import { SuccessResponse } from '../middleware/ApiResponse';

class HealthCheckController {

  checkHealth = asyncHandler(async (req, res) => {
    new SuccessResponse('The API is up and running. Health check is passed.', {}).send(res);
  });

}


export default new HealthCheckController();