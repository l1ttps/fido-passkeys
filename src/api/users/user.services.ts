import { AppDataSource } from "../../database/connect";
import { User } from "./user.entity";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
export default class UserService {
  userRepository = AppDataSource.getRepository(User);
  /**
   * Retrieves a list of users.
   *
   * @return {Array} An array of user objects.
   */
  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Creates a new user.
   *
   * @return {Promise<User>} The newly created user.
   */
  createUser(): Promise<User> {
    const newUser = new User();
    return this.userRepository.save(newUser);
  }

  /**
   * Generate the authentication options for a sign-in request.
   *
   * @param {Object} request - The sign-in request object.
   * @param {Request} request.request - The request object.
   * @return {Object} The generated authentication options.
   */
  signinRequest({ request }: { request: Request }) {
    return generateAuthenticationOptions({
      userVerification: "preferred",
      rpID: "localhost",
      allowCredentials: [],
    });
  }
}
