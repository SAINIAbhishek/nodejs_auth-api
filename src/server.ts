import app from './app';
import Logger from './middleware/Logger';
import { PORT } from './config';

app
  .listen(PORT, () => {
    Logger.info(`Server running on port : ${PORT}`);
  })
  .on('error', (e) => Logger.error(e));
