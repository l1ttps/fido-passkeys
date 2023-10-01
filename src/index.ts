import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import rootController from "./serve/index.controller";
import { CreateElysiaServer } from "./types";
import swagger from "@elysiajs/swagger";
import userController from "./api/users/user.controller";
import connectDatabase from "./database/connect";
import passKeysController from "./api/passkeys/passKeys.controller";

/**
 * Creates an Elysia server with the provided controllers and middlewares.
 *
 * @param {CreateElysiaServer} options - The options for creating the Elysia server.
 * @param {Array} options.controllers - The array of controllers to be used by the server.
 * @param {Array} options.middlewares - The array of middlewares to be used by the server.
 * @return {Elysia} - The created Elysia server instance.
 */
function createElysiaServer({
  controllers,
  middlewares,
  port,
}: CreateElysiaServer) {
  const app = new Elysia();

  if (middlewares && middlewares.length > 0) {
    for (const middleware of middlewares) {
      app.use(middleware);
    }
  }

  for (const controller of controllers) {
    const {
      routes,
      config: { prefix },
    } = controller();
    app.use(controller());
    routes.forEach((r: any) => {
      console.log(
        `API [${prefix}] - Mapped {${r.path.replace(prefix, "")},${r.method}}`
      );
    });
  }

  app.listen(port ?? 3000);

  return app;
}

/**
 * Initializes and starts the application server.
 *
 * @return {void}
 */
function bootstrap() {
  connectDatabase();
  const app = createElysiaServer({
    controllers: [rootController, userController, passKeysController],
    middlewares: [
      staticPlugin({
        prefix: "/",
      }),
      html(),
      swagger({
        path: "docs",
        documentation: {
          info: {
            title: "FIDO Passkeys",
            version: "1.0",
          },
        },
      }),
    ], // custom middlewares
    port: process.env.PORT,
  });
  console.log(`Server running on ${app.server?.port}`);
}

bootstrap();
