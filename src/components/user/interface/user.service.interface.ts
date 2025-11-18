import { CreateUserRequestDto } from "../dto/request/create-user.request.dto";
import { UpdateUserRequestDto } from "../dto/request/update-user.request.dto";

export interface IUserService {
    createUser(body:CreateUserRequestDto): Promise<any>;
    getUsers(): Promise<any>;
    deleteUser(id:string): Promise<any>;
    updateUser(id:string, body:UpdateUserRequestDto): Promise<any>;
}