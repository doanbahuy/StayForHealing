import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

export interface IBaseRepository<T> {
  create(data: T | any): Promise<T>;

  insert(data: any): Promise<InsertResult>;

  update(data: T | any): Promise<T>;

  findOneById(id: number): Promise<T>;

  findByCondition(filterCondition: any, withDeleted?: boolean): Promise<T[]>;

  find(options: any): Promise<T[]>;

  findOneByCondition(filterCondition: FindOneOptions): Promise<T>;

  findAll(): Promise<T[]>;

  remove(id: number): Promise<DeleteResult>;

  multipleRemove(ids: number[]): Promise<DeleteResult>;

  findWithRelations(relations: any): Promise<T[]>;

  findOneWithRelations(relations: any): Promise<T>;

  createEntity(data: any): T;

  createEntities(data: any): T;

  softDelete(id: number): Promise<UpdateResult>;
}
