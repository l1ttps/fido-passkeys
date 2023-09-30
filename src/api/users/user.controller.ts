import Elysia, { t } from "elysia";
import UserService from "./user.services";
import { SigninDto } from "./dto/signin.dto";
const userService = new UserService();
const apiTag = {
  detail: {
    tags: ["Auth"],
  },
};
/**
 * Generates a user controller.
 *
 * @return {Elysia} A new instance of Elysia.
 */
export default function userController() {
  return new Elysia({
    prefix: "users",
  })
    .get("", () => userService.getUsers(), apiTag)
    .post("signIn", ({ body }) => userService.signIn(body as SigninDto), {
      ...apiTag,
      body: t.Object({
        username: t.String(),
        password: t.String({
          minLength: 6,
          maxLength: 32,
        }),
      }),
    })
    .get(
      "signinRequest",
      ({ request }) => userService.signinRequest({ request }),
      apiTag
    );
}
