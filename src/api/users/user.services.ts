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

  /**
   * Creates a new user.
   *
   * @param {SigninDto} signinDto - The signin data transfer object containing the username and password.
   * @return {Promise<User>} The newly created user.
   */
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
   * Find a user by their ID.
   *
   * @param {string} id - The ID of the user.
   * @return {Promise<User>} A promise that resolves to the user with the given ID.
   */
  public async findUserById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      return user;
    } catch (e: Error | any) {
      throw new Error(e.message);
    }
  }
}
