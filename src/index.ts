import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import rootController from "./serve/index.controller";
import { CreateElysiaServer } from "./types";
import userController from "./users/user.controller";

function createElysiaServer({
  controllers,
  middlewares,
  prefix,
}: CreateElysiaServer) {
  const app = new Elysia();

  app.use(
    staticPlugin({
      prefix: "/",
    })
  );
  app.use(html());

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
  app.listen(3000);
  return app;
}

function bootstrap() {
  const app = createElysiaServer({
    controllers: [rootController, userController],
    middlewares: [], // custom middlewares
  });
  console.log(`Server running on ${app.server?.port}`);
}

bootstrap();
