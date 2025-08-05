export class LoggedInUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
    expiresIn: number;
    refreshToken: string;
    refreshTokenExpiration: string
    errors: string[];
  }
