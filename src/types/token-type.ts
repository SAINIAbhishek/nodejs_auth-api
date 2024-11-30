export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  sub: string;
  name: string;
  iss: string;
  aud: string;
  iat: number;
};
