type User = {
    id: number;
    role_id: number;
    name: string;
    email: string;
    email_verified: boolean;
    exp: number;
    iat: number;
}

export default User;