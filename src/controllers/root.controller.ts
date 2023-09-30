import Elysia from "elysia";

export default function rootControler() {
    return new Elysia({
        prefix: "/"
    }).get("/", ()=> Bun.file("public/index.html").text())
}