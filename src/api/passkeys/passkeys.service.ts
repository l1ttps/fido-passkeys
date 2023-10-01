import {
  generateAuthenticationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import UserService from "../users/user.services";
import {
  RegisterStartDto,
  RegisterStartResponseDto,
} from "./dto/registerStart.dto";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { AppDataSource } from "../../database/connect";
import { Passkeys } from "./passkeys.entity";
export default class PasskeysService {
  private userService = new UserService();
  private passKeysRepository = AppDataSource.getRepository(Passkeys);
  private challenges: any = {};
  private rpID = "localhost";
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
        userVerification: "required",
        rpID: this.rpID,
      });
      const { username } = user;
      const publicKey = {
        ...options,
        rp: { id: this.rpID, name: "fido-passkeys" },
        user: {
          id,
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
          requireResidentKey: false,
        },
      };
      this.challenges[username] = options.challenge;

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
  public async registerFinish({
    data,
    username,
    userId,
  }: any): Promise<Passkeys | Response> {
    try {
      const verification = await verifyRegistrationResponse({
        response: data,
        expectedChallenge: this.challenges[username],
        expectedOrigin: "http://localhost:5173",
        expectedRPID: this.rpID,
      });

      if (!verification.verified) {
        throw new Error("User verification failed.");
      }
      // @ts-ignore
      const { credentialPublicKey, credentialID } =
        verification.registrationInfo;

      // Create new passkey to database for user
      return this.passKeysRepository.save({
        publicKey: isoBase64URL.fromBuffer(credentialPublicKey),
        credentialID: isoBase64URL.fromBuffer(credentialID),
        user: userId,
      });
    } catch (e) {
      console.log(e);
      return new Response("Cannot verify registration", {
        status: 401,
      });
    }
  }
}
