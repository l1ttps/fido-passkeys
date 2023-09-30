import { AppDataSource } from "../../database/connect";
import { User } from "./user.entity";

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
}
