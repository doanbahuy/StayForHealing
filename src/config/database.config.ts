import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

dotenv.config();

const mongoDbConfig = {
  type: 'mongodb',
  databaseUri: process.env.DATABASE_URI,
  maxPool: parseInt(process.env.DATABASE_MAX_POOL) || 20,
  logging: false, //process.env.NODE_ENV === 'development',
};

@Injectable()
export default class DatabaseConfigService implements MongooseOptionsFactory {
  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    mongoose.set('debug', mongoDbConfig.logging);
    return {
      uri: mongoDbConfig.databaseUri,
    };
  }
}
