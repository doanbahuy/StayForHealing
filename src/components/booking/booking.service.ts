import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBookingService } from './interface/booking.service.interface';
import { CacheService } from '@core/components/cache/cache.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '@databases/postgres/entities/booking.entity';
import { In, Repository } from 'typeorm';
import { RoomEntity } from '@databases/postgres/entities/room.entity';
import { CreateBookingRequestDto } from './dto/request/create-booking.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToInstance } from 'class-transformer';
import { BookingResponseDto } from './dto/response/booking.response.dto';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { toDateOnly } from '@databases/postgres/helpers/toDate';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { BookingEnum } from '@constant/common';
import { ResponsePayload } from '@utils/response-payload';
import { BookingRepository } from '@repositories/booking.repository';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    private readonly cacheService: CacheService,

    @Inject('IBookingRepository')
    private readonly bookingRepository: BookingRepository,

    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  //Methods
  async createBooking(
    data: CreateBookingRequestDto,
  ): Promise<ResponsePayload<BookingResponseDto>> {
    const room = await this.roomRepository.findOne({
      where: { id: data.roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found!');
    }

    const isRoomValid = await this.__validateRoom(data);
    if (!isRoomValid) throw new BadRequestException('Room is not available!');

    const accountData = await this.accountRepository.findOne({
      where: { id: data.accountId },
    });
    if (!accountData) throw new NotFoundException('Account not found');

    const bookingData = await this.bookingRepository.createEntity(data);
    bookingData.room = room;
    bookingData.account = accountData;

    await this.bookingRepository.create(bookingData);

    return new ResponseBuilder(
      plainToInstance(BookingResponseDto, bookingData, {
        excludeExtraneousValues: true,
      }),
    )
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success create booking!')
      .build();
  }

  async getBookings(): Promise<ResponsePayload<BookingResponseDto[]>> {
    const cacheKey = 'booking:list';

    const cached = await this.cacheService.getCache(cacheKey);
    if (cached) {
      return new ResponseBuilder(cached)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('Success (cache)!')
        .build();
    }

    const bookings = await this.bookingRepository.find();
    if (!bookings || bookings.length === 0) {
      throw new NotFoundException('Bookings not found!');
    }

    const result = plainToInstance(BookingResponseDto, bookings, {
      excludeExtraneousValues: true,
    });

    await this.cacheService.setCache(cacheKey, result, 60); // TTL 60s

    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success!')
      .build();
  }

  async getDetailBooking(
    id: number,
  ): Promise<ResponsePayload<BookingResponseDto>> {
    const cacheKey = `booking:detail:${id}`;

    const cached = await this.cacheService.getCache(cacheKey);
    if (cached) {
      return new ResponseBuilder(cached)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('Success (cache)!')
        .build();
    }

    const booking = await this.bookingRepository.findOneById(id);
    if (!booking) throw new NotFoundException('Booking not found!');

    const result = plainToInstance(BookingResponseDto, booking, {
      excludeExtraneousValues: true,
    });

    await this.cacheService.setCache(cacheKey, result, 60);

    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success!')
      .build();
  }

  async cancelBooking(
    id: number,
  ): Promise<ResponsePayload<BookingResponseDto>> {
    const booking = await this.bookingRepository.findOneByCondition({
      where: { id, status: BookingEnum.CANCEL },
    });
    if (!booking) throw new NotFoundException('Booking not found!');

    booking.status = BookingEnum.CANCEL;

    await this.bookingRepository.create(booking);

    return new ResponseBuilder(
      plainToInstance(BookingResponseDto, booking, {
        excludeExtraneousValues: true,
      }),
    )
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success!')
      .build();
  }

  //General funcion
  async __validateRoom(data: CreateBookingRequestDto): Promise<boolean> {
    const bookings = await this.bookingRepository.find({
      where: {
        room: { id: data.roomId },
        status: In([BookingEnum.PENDING, BookingEnum.CHECKED]),
      },
    });

    if (bookings.length === 0) {
      return true;
    }

    const newCheckIn = toDateOnly(data.checkInDate);
    const newCheckOut = toDateOnly(data.checkOutDate);

    for (const booking of bookings) {
      const existingCheckIn = toDateOnly(booking.checkInDate);
      const existingCheckOut = toDateOnly(booking.checkOutDate);

      const isOverlap =
        newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;

      if (isOverlap) {
        return false;
      }
    }
    return true;
  }
}
