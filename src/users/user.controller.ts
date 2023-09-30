import Elysia from "elysia";

export default function userController() {
    return new Elysia({
        prefix: "users"
    }).get("", () => { }).post("createAccount", () => { })
}
