import { html } from '@elysiajs/html';
import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import rootControler from './serve/index.controller';
import { CreateElysiaServer } from './types';
import userController from './users/user.controller';


function createElysiaServer({controllers, prefix}: CreateElysiaServer) {
  const app =  new Elysia({
    prefix:  prefix || "/"
  })
  .use(staticPlugin({
    prefix: "/"
  }))
  .use(html())
  for (const controller of controllers) {
    const {routes, config: {prefix}} = controller()
    routes.forEach((r: any) => {
      console.log(`API [${prefix}] - Mapped {${r.path.replace(prefix,"")},${r.method}}`);
    })
  }
  return app
}


function bootstrap() {
  const app =  createElysiaServer({
  controllers: [rootControler, userController]
  })
  console.log(`🚀 Server running ${app.server}`);
}
 

bootstrap()