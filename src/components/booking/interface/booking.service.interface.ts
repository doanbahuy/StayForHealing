import { ResponsePayload } from '@utils/response-payload';
import { CreateBookingRequestDto } from '../dto/request/create-booking.request.dto';
import { BookingResponseDto } from '../dto/response/booking.response.dto';

export interface IBookingService {
  createBooking(
    data: CreateBookingRequestDto,
  ): Promise<ResponsePayload<BookingResponseDto>>;
  getBookings(filter?: any): Promise<ResponsePayload<BookingResponseDto[]>>;
  getDetailBooking(id: number): Promise<ResponsePayload<BookingResponseDto>>;
  cancelBooking(id: number): Promise<ResponsePayload<BookingResponseDto>>;
}
