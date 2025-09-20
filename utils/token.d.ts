export interface JwtPayload {
    id: number;
    email: string;
    username: string;
}
export declare const generateToken: (user: JwtPayload) => string;
//# sourceMappingURL=token.d.ts.map