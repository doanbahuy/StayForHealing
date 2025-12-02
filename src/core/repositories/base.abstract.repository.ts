import { IBaseRepository } from './base.interface.repository';

import * as typeorm from 'typeorm';
import { DeepPartial } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

export abstract class BaseAbstractRepository<T> implements IBaseRepository<T> {
  private entity: typeorm.Repository<T>;

  protected constructor(entity: typeorm.Repository<T>) {
    this.entity = entity;
  }
  createEntity(data: any): T {
    throw new Error('Method not implemented.');
  }

  createEntities(data: any): T {
    throw new Error('Method not implemented.');
  }

  public async create(data: T | any): Promise<T> {
    return await this.entity.save(data);
  }

  public async insert(data: any): Promise<typeorm.InsertResult> {
    return await this.entity.insert(data);
  }

  public async save(entities: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.save(entities);
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

  public async find(options?: typeorm.FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async findOneByCondition(condition: FindOneOptions): Promise<T> {
    return await this.entity.findOne(condition);
  }

  public async findAndCount(filterCondition: any): Promise<any> {
    return await this.entity.findAndCount(filterCondition);
  }

  public async findWithRelations(relations: any): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findOneWithRelations(relations: any): Promise<T> {
    return await this.entity.findOne(relations);
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.find();
  }

  public async remove(id: number): Promise<typeorm.DeleteResult> {
    return await this.entity.delete(id);
  }

  public async multipleRemove(ids: number[]): Promise<typeorm.DeleteResult> {
    return await this.entity.delete(ids);
  }

  public async softDelete(id: number): Promise<typeorm.UpdateResult> {
    return await this.entity.softDelete(id);
  }

  // public async deleteByCondition(
  //   condition: typeorm.FindOptionsWhere<T>,
  // ): Promise<typeorm.DeleteResult> {
  //   return this.entity.delete(condition);
  // }
}
