import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserRequestDto {    
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    name: string
}