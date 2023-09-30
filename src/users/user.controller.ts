import Elysia from "elysia";
import UserService from "./user.services";
const userService = new UserService();
const apiTag = {
      detail: {
        tags: ['Auth']
      }}
export default function userController() {
  return new Elysia({
    prefix: "users",
  
  })
    .get("", () => userService.getUsers(), apiTag)
    .post("createAccount", () => userService.createUser(),  apiTag);
}
