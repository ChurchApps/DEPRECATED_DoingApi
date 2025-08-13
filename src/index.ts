import { init } from "./app";
import { Pool } from "@churchapps/apihelper";
import { Environment } from "./helpers/Environment";

const port = process.env.SERVER_PORT;

console.log(`Starting DoingApi...`);

Environment.init(process.env.APP_ENV || "dev")
  .then(() => {
    console.log(`Environment initialized`);
    Pool.initPool();
    console.log(`Pool initialized`);

    init()
      .then(app => {
        console.log(`App initialized, starting server on port ${port}...`);
        app.listen(port, () => {
          console.log(`🚀 DoingApi server started on port ${port}`);
        });
      })
      .catch(error => {
        console.error(`Failed to initialize app:`, error);
        throw new Error(`Failed to initialize app: ${error.message}`);
      });
  })
  .catch(error => {
    console.error(`Failed to initialize environment:`, error);
    throw new Error(`Failed to initialize environment: ${error.message}`);
  });
