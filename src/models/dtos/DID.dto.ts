import {DID} from "../entities/DID";
import {Field, InputType} from "type-graphql";
import {IsNotEmpty, MaxLength} from "class-validator";

/**
 * Create DID DTO
 *
 * @author Yepeng Ding
 */
@InputType()
export class CreateDID implements Partial<DID> {

    @Field()
    @IsNotEmpty()
    @MaxLength(55)
    method: string

    @Field()
    @IsNotEmpty()
    @MaxLength(55)
    methodIdentifier: string

}
