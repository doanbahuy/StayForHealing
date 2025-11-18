import { CreateUserRequestDto } from "../dto/request/create-user.request.dto";
import { UpdateUserRequestDto } from "../dto/request/update-user.request.dto";

export interface IUserService {
    createUser(body:CreateUserRequestDto): Promise<any>;
    getUsers(): Promise<any>;
    deleteUser(id:number): Promise<any>;
    updateUser(id:number, body:UpdateUserRequestDto): Promise<any>;
    getUserById(id:number): Promise<any>;
}