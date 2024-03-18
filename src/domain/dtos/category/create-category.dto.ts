

export class CreateCateagoryDto {
    
    private constructor (
    public readonly name: string,
    public readonly available: boolean,
    ) {}

    static create ( object: { [ key: string ]: any } ):  [ string?, CreateCateagoryDto? ] {
        
        const { name, available = false } = object;
        let availableBoolean = available;

        if ( !name ) return [ 'Miising name' ];
        if ( typeof available !== 'boolean' ) {
            availableBoolean = ( available === 'true' );
        }

        return [ undefined, new CreateCateagoryDto( name, availableBoolean ) ];
    }
}