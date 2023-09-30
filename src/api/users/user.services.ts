import { AppDataSource } from "../../database/connect";
import { SigninDto } from "./dto/signin.dto";
import { User } from "./user.entity";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
export default class UserService {
  userRepository = AppDataSource.getRepository(User);
  /**
   * Retrieves a list of users.
   *
   * @return {Array} An array of user objects.
   */
  public getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Handle login, if account not existing, create new account
   *
   * @return {Promise<User>} The newly created user.
   */
  public async signIn({
    username,
    password,
  }: SigninDto): Promise<User | Response | null> {
    if (await this.checkUserExist(username)) {
      return this.userRepository.findOne({
        where: {
          username,
        },
      });
    }
    return this.createNewUser({ username, password });
  }

  private async createNewUser({
    username,
    password,
  }: SigninDto): Promise<User> {
    const newUser = new User();
    newUser.username = username;
    const passwordHashed = await Bun.password.hash(password);
    newUser.password = passwordHashed;
    return this.userRepository.save(newUser);
  }

  /**
   * Checks if a user exists.
   *
   * @param {string} username - The username to check.
   * @return {Promise<boolean>} Returns a promise that resolves to true if the user exists, and false otherwise.
   */
  private async checkUserExist(username: string): Promise<boolean> {
    const check = await this.userRepository.count({ where: { username } });
    return check > 0;
  }

  /**
   * Generate the authentication options for a sign-in request.
   *
   * @param {Object} request - The sign-in request object.
   * @param {Request} request.request - The request object.
   * @return {Object} The generated authentication options.
   */
  public signinRequest({ request }: { request: Request }) {
    return generateAuthenticationOptions({
      userVerification: "preferred",
      rpID: "localhost",
      allowCredentials: [],
    });
  }
}
