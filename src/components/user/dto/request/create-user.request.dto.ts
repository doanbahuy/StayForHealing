import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserRequestDto {
    @IsNotEmpty()
    @IsString()
    username: string;
    @IsNotEmpty()
    @IsString()
    password: string
}