import { generateAuthenticationOptions } from "@simplewebauthn/server";
import UserService from "../users/user.services";
import { RegisterStartDto } from "./dto/registerStart.dto";

export default class PasskeysService {
  private userService = new UserService();
  public async registerStart({ id }: RegisterStartDto) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new Response("User not found", {
          status: 401,
        });
      }
      const options = await generateAuthenticationOptions({
        userVerification: "preferred",
        rpID: "localhost",
        allowCredentials: [],
      });
      const { username } = user;
      const publicKey = {
        ...options,
        user: {
          id,
          username,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
      };
      return publicKey;
    } catch (e) {
      throw new Response("Cannot register", {
        status: 400,
      });
    }
  }
}
