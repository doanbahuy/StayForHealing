import { BaseAbstractRepository } from '../core/repositories/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@databases/postgres/entities/user.entity';
import { IUserRepository } from './interface/user.repository.interface';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  createEntity(data: any) {
    const entity = new UserEntity();
    Object.assign(entity, data);

    return entity;
  }

  createEntities(data: any) {
    return data.map((item: any) => {
      const entity = new UserEntity();

      Object.assign(entity, item);
      return entity;
    });
  }

  async detailUser(request: any) {
    const query = this.repository
      .createQueryBuilder('user')
      .select('user.id', 'id')
      .innerJoin(
        'user_details',
        'user_detail',
        'user_detail.user_id = user.id  ',
      )
      .where('user.id = :id', { id: request.id })
      .addSelect('user.username', 'username')
      .addSelect('user.phone_number', 'phone_number')
      .addSelect('user.partner_code', 'partner_code')
      .addSelect('user.partner_id', 'partner_id')
      .addSelect('user_detail.fullname', 'fullname')
      .addSelect('user_detail.gender', 'gender')
      .addSelect('user_detail.gender_code', 'gender_code')
      .addSelect('user_detail.email', 'email')
      .addSelect('user_detail.birth_date', 'birth_date')
      .addSelect('user_detail.citizen_pid', 'citizen_pid')
      .addSelect('user_detail.date_of_issue', 'date_of_issue')
      .addSelect('user_detail.id_card_expire_date', 'id_card_expire_date')
      .addSelect('user_detail.issuing_authority', 'issuing_authority')
      .addSelect('user_detail.living_place_address', 'living_place_address')
      .addSelect('user_detail.hub_code', 'hubCode')
      .addSelect(
        'user_detail.living_place_village_code',
        'living_place_village_code',
      );
    return query.getRawOne();
  }
}
