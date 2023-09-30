import Elysia from "elysia";

/**
 * This function serves as the root controller for the application.
 * Render the index.html file for the application.
 *
 * @returns {Elysia} The root controller instance.
 */
export default function rootController() {
  return new Elysia({
    prefix: "/",
  }).get("", () => Bun.file("public/index.html").text());
}
