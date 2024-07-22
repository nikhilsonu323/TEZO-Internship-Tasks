export interface LoginUser{
    email: string;
    password: string;
}

export interface RegisterUser{
    email: string;
    password: string;
    imageData: string;
    name: string;
}

export class User{
    constructor(
        public name: string,
        public email: string,
        public imageData: string,
        private _token: string,
        private _expiresIn: Date
    ){}

    get token():string{
        return this._token;
    }
}