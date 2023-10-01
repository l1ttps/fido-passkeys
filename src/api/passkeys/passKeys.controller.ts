import Elysia from "elysia";
const swagger = {
  detail: {
    tags: ["Passkeys"],
    description: "alo",
  },
};
export default function passKeysController() {
  return new Elysia({
    prefix: "/passkeys",
  })
    .group("/register", (app) => {
      return app
        .post("/start", () => {}, swagger)
        .post("finish", () => {}, swagger);
    })
    .group("/one-click", (app) => {
      return app
        .post("/start", () => {}, swagger)
        .post("finish", () => {}, swagger);
    });
}
