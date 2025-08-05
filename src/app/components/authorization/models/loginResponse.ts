export class LoginResponse <T = any> {
    data! : T;
    result: number;
    description: string
}

export class TokenResponse {
    access_token: string;
    token_type:string;
    expires_in: number;
    refresh_token: string;
}