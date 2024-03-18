import { Validators } from "../../../config";


export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string, //! id
        public readonly category: string, //! id
    ) { }

    static create( props: { [ key: string] : any } ): [ string?, CreateProductDto? ] {

        const { name, available, price, description, user, category } = props;

        if ( !name ) return [ 'name is required' ];
        if ( !user ) return [ 'user is required' ];
        if ( !Validators.isMongoID( user ) ) return [ 'invalid user ID' ];
        if ( !category ) return [ 'category is required' ];
        if ( !Validators.isMongoID( category ) ) return [ 'invalid category ID' ];

        return [ undefined, new CreateProductDto( name, !!available, price, description, user, category ) ];
    }

}