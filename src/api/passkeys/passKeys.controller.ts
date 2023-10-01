import Elysia, { t } from "elysia";
import PasskeysService from "./passkeys.service";
const swagger = {
  detail: {
    tags: ["Passkeys"],
  },
};
export default function passKeysController() {
  const passKeysService = new PasskeysService();
  return new Elysia({
    prefix: "/passkeys",
  })
    .group("/register", (app) => {
      return app
        .post(
          "/generate-public-key",
          ({ body }) => passKeysService.registerStart(body),
          {
            body: t.Object({
              id: t.String(),
            }),
            detail: {
              summary: "Generate public key",
              tags: ["Passkeys"],
            },
          }
        )
        .post("verification", (body) => passKeysService.registerFinish(body), {
          detail: {
            summary: "Verify registration",
            tags: ["Passkeys"],
          },
        });
    })
    .group("/one-click", (app) => {
      return app
        .post("/start", () => {}, swagger)
        .post("finish", () => {}, swagger);
    });
}
