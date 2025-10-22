import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { logExecutionTime } from 'mongoose-execution-time';
dotenv.config();

const mongoDbConfig = {
    type: 'mongodb',
    databaseUri: process.env.DATABASE_MONGO_URI,
    maxPool: parseInt(process.env.DATABASE_MAX_POOL) || 20,
    logging: false, //process.env.NODE_ENV === 'development',
}