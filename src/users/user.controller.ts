import Elysia from "elysia";
import UserService from "./user.services";
const userService = new UserService();
export default function userController() {
  return new Elysia({
    prefix: "users",
  })
    .get("", () => userService.getUsers())
    .post("createAccount", () => userService.createUser());
}
