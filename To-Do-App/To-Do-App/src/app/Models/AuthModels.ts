export interface User{
    username: string;
    password: string;
}

export enum AuthType{
    Login,
    Signup
}