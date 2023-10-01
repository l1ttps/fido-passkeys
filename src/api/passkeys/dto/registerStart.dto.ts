export interface RegisterStartDto {
  id: string;
}

export interface RegisterStartResponseDto {
  challenge: string;
  allowCredentials: any[];
  timeout: number;
  userVerification: string;
  rpId: string;
  user: {
    id: string;
    username: string;
  };
  pubKeyCredParams: PubKeyCredParam[];
}

export interface PubKeyCredParam {
  type: string;
  alg: number;
}
