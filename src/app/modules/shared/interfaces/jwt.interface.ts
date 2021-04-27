export interface Usuario {
    nombre: string;
    email: string;
    token: Token;
}

export interface Token {
    access_token: string;
    expires_in: number;
    token_type: string;
}