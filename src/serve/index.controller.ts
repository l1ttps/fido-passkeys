import Elysia from "elysia";

export default function rootController() {
    return new Elysia({
        prefix: "/"
    }).get("", ()=> Bun.file("public/index.html").text())
}