/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponsePayload } from '@utils/response-payload';
import { CreateHomestayRequestDto } from '../dto/request/create-homestay.request.dto';
import { HomestayResponseDto } from '../dto/response/homestay.response.dto';
import { UpdateHomestayRequestDto } from '../dto/request/update-homestay.request';

export interface IHomestayService {
  getHomestay(
    host?: any,
    filer?: any,
  ): Promise<ResponsePayload<HomestayResponseDto[]>>;
  getHomestayById(id: number): Promise<ResponsePayload<HomestayResponseDto>>;
  createHomestay(
    req: any,
    body: CreateHomestayRequestDto,
  ): Promise<ResponsePayload<HomestayResponseDto>>;
  updateHomestay(
    id: number,
    data: UpdateHomestayRequestDto,
  ): Promise<ResponsePayload<HomestayResponseDto>>;
  deleteHomestay(id: number): Promise<ResponsePayload<HomestayResponseDto>>;
}
