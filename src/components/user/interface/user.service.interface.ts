import { ResponsePayload } from '@utils/response-payload';
import { CreateUserRequestDto } from '../dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { UsersResponseDto } from '../dto/response/users.response.dto';

export interface IUserService {
  getUsersByName(
    params: string,
  ):
    | ResponsePayload<UsersResponseDto[]>
    | PromiseLike<ResponsePayload<UsersResponseDto[]>>;
  createUser(
    body: CreateUserRequestDto,
  ): Promise<ResponsePayload<UsersResponseDto>>;
  getUsers(): Promise<ResponsePayload<UsersResponseDto[]>>;
  deleteUser(id: string): Promise<ResponsePayload<UsersResponseDto>>;
  updateUser(
    id: string,
    body: UpdateUserRequestDto,
  ): Promise<ResponsePayload<UsersResponseDto>>;
  getUserById(id: string): Promise<ResponsePayload<UsersResponseDto>>;
}
