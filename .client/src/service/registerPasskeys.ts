import api from "./api";

/**
 * Registers passkeys for a user.
 *
 * @param {string} userId - The user ID.
 * @return {Promise<boolean>} A promise that resolves to a boolean indicating the success of the registration.
 */
export default async function registerPasskeys(
  userId: string
): Promise<boolean> {
  console.log(userId);
  const options = await api
    .post("/passkeys/register/generate-public-key", {
      id: userId,
    })
    .then((res) => res.data);
  const fido = await fidoCreate(options);
  return api.post("/passkeys/register/verification", fido);
}

/**
 * Generates a FIDO credential for a given user.
 *
 * @param {any} options - The options for creating the FIDO credential.
 * @return {object} - An object containing the generated FIDO credential and the username of the user.
 */
async function fidoCreate(options: any) {
  const userId = options.user.id;
  options.user.id = base64url.decode(options.user.id);
  options.challenge = base64url.decode(options.challenge);
  if (options.excludeCredentials) {
    for (let cred of options.excludeCredentials) {
      cred.id = base64url.decode(cred.id);
    }
  }
  // Use platform authenticator and discoverable credential
  options.authenticatorSelection = {
    authenticatorAttachment: "platform",
    requireResidentKey: true,
  };

  // Invoke WebAuthn create
  const cred: any = await navigator.credentials.create({
    publicKey: options,
  });

  let credential: any = {};
  credential.id = cred.id;
  credential.rawId = base64url.encode(cred.rawId);
  credential.type = cred.type;
  if (cred.authenticatorAttachment) {
    credential.authenticatorAttachment = cred.authenticatorAttachment;
  }
  const clientDataJSON = base64url.encode(cred.response.clientDataJSON);
  const attestationObject = base64url.encode(cred.response.attestationObject);
  const transports = cred.response.getTransports
    ? cred.response.getTransports()
    : [];
  credential.response = {
    clientDataJSON,
    attestationObject,
    transports,
  };
  console.log(options);
  return {
    data: credential,
    userId,
    username: options.user.name,
  };
}

const base64url = {
  /**
   * Encodes a buffer into a base64 string.
   *
   * @param {Buffer} buffer - The buffer to encode.
   * @return {string} The base64 encoded string.
   */
  encode: function (buffer: Buffer) {
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  },

  /**
   * Encodes a buffer into a base64 string.
   *
   * @param {Buffer} buffer - The buffer to encode.
   * @return {string} The base64 encoded string.
   */
  decode: function (base64url: string) {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const binStr = window.atob(base64);
    const bin = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bin[i] = binStr.charCodeAt(i);
    }
    return bin.buffer;
  },
};
