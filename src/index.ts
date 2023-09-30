import { html } from '@elysiajs/html';
import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import rootControler from './controllers/root.controller';
const app = new Elysia()
  .use(staticPlugin({
    prefix: "/"
  }))
  .use(html())

  .use(rootControler())
    .listen(3000)

  console.log(`🚀 Server running on ${app.server?.port}`);
