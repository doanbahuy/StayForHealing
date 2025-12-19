import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { IBookingService } from './interface/booking.service.interface';
import { CreateBookingRequestDto } from './dto/request/create-booking.request.dto';
import { Public } from '@core/decorator/set-public.decorator';
import { BookingResponseDto } from './dto/response/booking.response.dto';
import { ResponsePayload } from '@utils/response-payload';

@Public()
@Controller('bookings')
export class BookingController {
  constructor(
    @Inject('IBookingService')
    private readonly bookingService: IBookingService,
  ) {}

  @Post('')
  async createBooking(
    @Body() data: CreateBookingRequestDto,
  ): Promise<ResponsePayload<BookingResponseDto>> {
    return this.bookingService.createBooking(data);
  }

  @Get('')
  async getBookings(
    filter?: any,
  ): Promise<ResponsePayload<BookingResponseDto[]>> {
    return this.bookingService.getBookings(filter);
  }

  @Get('/:id')
  async getDetailBooking(
    @Param('id') id: number,
  ): Promise<ResponsePayload<BookingResponseDto>> {
    console.log('asdaksjdhasd');
    console.log(id);
    return this.bookingService.getDetailBooking(id);
  }

  @Post('/:id/cancel')
  async cancelBooking(
    @Param('id') id: number,
  ): Promise<ResponsePayload<BookingResponseDto>> {
    return this.bookingService.cancelBooking(id);
  }
}
