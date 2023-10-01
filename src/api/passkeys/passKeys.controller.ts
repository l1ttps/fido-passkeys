import Elysia, { t } from "elysia";
import PasskeysService from "./passkeys.service";
const swagger = {
  detail: {
    tags: ["Passkeys"],
    description: "alo",
  },
};
export default function passKeysController() {
  const passKeysService = new PasskeysService();
  return new Elysia({
    prefix: "/passkeys",
  })
    .group("/register", (app) => {
      return app
        .post("/start", ({ body }) => passKeysService.registerStart(body), {
          body: t.Object({
            id: t.String(),
          }),
          ...swagger,
        })
        .post("finish", () => {}, swagger);
    })
    .group("/one-click", (app) => {
      return app
        .post("/start", () => {}, swagger)
        .post("finish", () => {}, swagger);
    });
}
