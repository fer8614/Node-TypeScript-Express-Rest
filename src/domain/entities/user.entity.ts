import { CustomError } from "../errors/custom.error";


export class UserEntity {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public role: string[],
        public img?: string,
    ) { }

        static fromObject( object: { [key: string]: any } ) {
            const { id, _id,name, email, emailValidated, password, role, img } = object;

            if( !_id && !id ) {
                throw CustomError.badRequest('Missing id');
            }

            if ( !name ) throw CustomError.badRequest('Name must not be defined');
            if ( !email ) throw CustomError.badRequest('Email must not be defined');
            if ( emailValidated === undefined ) throw CustomError.badRequest('Missing EmailValidated');
            if ( !password ) throw CustomError.badRequest('Password must not be defined');
            if ( !role ) throw CustomError.badRequest('Role must not be defined');


            return new UserEntity(
                id || _id,
                name,
                email,
                emailValidated,
                password,
                role,
                img,
            )
        }
}