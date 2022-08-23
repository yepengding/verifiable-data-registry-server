import {IsNotEmpty, MaxLength} from "class-validator";

export class CreateDIDBody {
    @IsNotEmpty()
    @MaxLength(55)
    public method: string;

    @IsNotEmpty()
    @MaxLength(255)
    public methodIdentifier: string;
}
