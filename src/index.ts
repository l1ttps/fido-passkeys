import { html } from '@elysiajs/html';
import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
new Elysia()
  .use(staticPlugin())
  .use(html())
    .listen(3000)