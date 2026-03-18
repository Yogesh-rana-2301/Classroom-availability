import { logger } from "../common/logger/logger.js";

export function bootstrap(app, port) {
  app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
  });
}
