import {
  generateAuthenticationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import UserService from "../users/user.services";
import {
  RegisterStartDto,
  RegisterStartResponseDto,
} from "./dto/registerStart.dto";

export default class PasskeysService {
  private userService = new UserService();
  /**
   * Registers the start of a user.
   *
   * @param {RegisterStartDto} id - The ID of the user to register.
   * @return {Promise<PublicKey>} publicKey - The generated public key.
   * @throws {Response} "User not found" - If the user is not found.
   * @throws {Response} "Cannot register" - If registration fails.
   */
  public async registerStart({
    id,
  }: RegisterStartDto): Promise<RegisterStartResponseDto> {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new Response("User not found", {
          status: 404,
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
      return publicKey as RegisterStartResponseDto;
    } catch (e) {
      throw new Response("Cannot register", {
        status: 400,
      });
    }
  }

  /**
   * Registers the finish of the registration process.
   *
   * @param {object} data - The data object containing the registration information.
   * @return {Promise<boolean>} Returns a promise that resolves to a boolean indicating whether the registration was successfully finished.
   */
  public async registerFinish({ data }: any): Promise<boolean> {
    const { verified, registrationInfo } = await verifyRegistrationResponse({
      expectedChallenge: "challenge",
      expectedOrigin: "localhost",
      response: {
        ...data,
      },
    });

    if (verified) {
      console.log(registrationInfo);
      return true;
    }
    return false;
  }
}
