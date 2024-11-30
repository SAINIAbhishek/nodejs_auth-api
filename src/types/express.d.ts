declare namespace Express {
  export type Request = {
    user?: {
      id: string;
      email: string;
      firstname: string;
      passwordResetTokenRaw?: string;
    };
    session: {
      accessToken: string;
      refreshToken: string;
      userId: string;
    };
    resetPassword: {
      isPasswordUpdated: boolean;
    };
  };
}
