import { IBasePostgresRepository } from './base.interface.repository';

import { PaginationQuery } from '@utils/pagination.query';

import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

export abstract class BasePostgresRepository<T>
  implements IBasePostgresRepository<T>
{
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }
  createEntity(data: any): T {
    throw new Error('Method not implemented.');
  }

  public async create(data: T | any, queryRunner?: QueryRunner): Promise<T> {
    if (queryRunner) {
      return await queryRunner.manager.save(this.createEntity(data));
    }
    return await this.entity.save(data);
  }

  public async update(data: T | any): Promise<T> {
    return await this.entity.save(data);
  }

  public async findOneById(id: number): Promise<T> {
    const condition: any = {
      where: { id: id },
    };
    return await this.entity.findOne(condition);
  }

  public async findByCondition(
    filterCondition: any,
    withDeleted = false,
  ): Promise<T[]> {
    return await this.entity.find({
      where: filterCondition,
      withDeleted: withDeleted,
    });
  }

  public async findByConditionWithPage(
    filterCondition: FindOptionsWhere<T>,
    skip: number,
    take: number,
    withDeleted = false,
  ) {
    return await this.entity.find({
      where: filterCondition,
      withDeleted: withDeleted,
      take: take,
      skip: skip * take,
    });
  }

  public async findOneByCondition(condition: any): Promise<T> {
    return await this.entity.findOne({ where: { ...condition } });
  }

  public async findAndCount(filterCondition: any): Promise<any> {
    return await this.entity.findAndCount(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findOneWithRelations(relations: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(relations);
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.find();
  }

  public async find(conditions: any): Promise<T[]> {
    return await this.entity.find(conditions);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return await this.entity.delete(id);
  }

  public async multipleRemove(ids: number[]): Promise<DeleteResult> {
    return await this.entity.delete(ids);
  }

  public async softDelete(id: number): Promise<UpdateResult> {
    return await this.entity.softDelete(id);
  }

  public async removeByCondition(condition: FindOptionsWhere<T>) {
    return await this.entity.delete(condition);
  }

  public createQueryBuilder(): SelectQueryBuilder<T> {
    return this.entity.createQueryBuilder();
  }

  public softDeleteWithConfition(condition: FindOptionsWhere<T>) {
    return this.entity.softDelete(condition);
  }
}
