/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponsePayload } from '@utils/response-payload';
import { CreateHomestayRequestDto } from '../dto/request/create-homestay.request.dto';
import { HomestayResponseDto } from '../dto/response/homestay.response.dto';

export interface IHomestayService {
  getHomestays(filer?: any): Promise<ResponsePayload<HomestayResponseDto[]>>;
  getHomestayById(id: number): Promise<ResponsePayload<HomestayResponseDto>>;
  createHomestay(data: any): Promise<ResponsePayload<HomestayResponseDto>>;
  updateHomestay(
    id: number,
    data: any,
  ): Promise<ResponsePayload<HomestayResponseDto>>;
  deleteHomestay(id: number): Promise<ResponsePayload<HomestayResponseDto>>;
}
