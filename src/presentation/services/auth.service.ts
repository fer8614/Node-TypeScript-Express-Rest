import { JWTAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";


export class AuthService {

    //! DI Dependency Injection
    constructor(
        //! DI Dependency Injection - Email Service
        private readonly emailService: EmailService,
    ) {
        
    }


    public async registerUser( registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if ( existUser ) throw CustomError.badRequest('User already exist');

        try {

            const user = new UserModel(registerUserDto);
            
            //! Encrypt password
            user.password = bcryptAdapter.hash( registerUserDto.password );

            await user.save();
            //! JWT --> Authentication User

            //! Confirm email
            await this.sendEmailValidationLink( user.email );

            const { password, ...userEntity } = UserEntity.fromObject( user )

            const token = await JWTAdapter.generateToken( { id: user.id } );
            if ( !token ) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: userEntity,
                token: token,
            };
            
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }
    }

    public async loginUser( loginUserDto: LoginUserDto ) {

        const existUser = await UserModel.findOne({ email: loginUserDto.email });
        if ( !existUser ) throw CustomError.badRequest('Email not exist');

        const isValidPassword = bcryptAdapter.compare( loginUserDto.password, existUser.password );
        if ( !isValidPassword ) throw CustomError.badRequest('Invalid password');

        const { password, ...userEntity } = UserEntity.fromObject( existUser )
        
        const token = await JWTAdapter.generateToken( { id: existUser.id } );
        if ( !token ) throw CustomError.internalServer('Error while creating JWT');
        return {
            user: userEntity,
            token: token,
        };

    }

    private sendEmailValidationLink = async ( email: string ) => {
        
        const token = await JWTAdapter.generateToken( { email } );
        if ( !token ) throw CustomError.internalServer('Error getting token');

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
        const html = `
            <h1>Validate Email</h1>
            <p>Click on the following link to validate your email</p>
            <a href=${ link }>Validate your email: ${ email }</a>    
        `;

        const options = {
            to: email,
            subject: 'Validate Email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail( options );
        if ( !isSent ) throw CustomError.internalServer('Error while sending email');

        return true;
    }

    public validateEmail = async ( token: string ) => {
        const payload = await JWTAdapter.validateToken( token );
        if ( !payload ) throw CustomError.badRequest('Invalid token');
        
        const { email } = payload as { email: string };
        if ( !email ) throw CustomError.badRequest('Invalid token');

        const user = await UserModel.findOne({ email });
        if ( !user ) throw CustomError.internalServer('Email not exist');
        
        user.emailValidated = true;
        await user.save();

        return true;
    }
}