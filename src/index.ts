import { init } from "./app";
import { Pool } from "@churchapps/apihelper";
import { Environment } from "./helpers/Environment";

const port = process.env.SERVER_PORT;

Environment.init(process.env.APP_ENV || "dev")
  .then(() => {
    Pool.initPool();

    init()
      .then(app => {
        app.listen(port, () => {
          // Server started successfully
        });
      })
      .catch(error => {
        throw new Error(`Failed to initialize app: ${error.message}`);
      });
  })
  .catch(error => {
    throw new Error(`Failed to initialize environment: ${error.message}`);
  });
