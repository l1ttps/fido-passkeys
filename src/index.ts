import { html } from '@elysiajs/html';
import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import rootControler from './controllers/root.controller';
new Elysia()
  .use(staticPlugin())
  .use(html())
  .use(rootControler())
    .listen(3000)