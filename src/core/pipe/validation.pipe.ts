// import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
// import { plainToClass } from 'class-transformer';
// import { isJson } from 'src/helper/string.helper';

// @Injectable()
// export class Validation implements PipeTransform<any> {
//   constructor() {}

//   async transform(value, metadata: ArgumentMetadata) {
//     const { metatype, type } = metadata;
//     if (!metatype || !this.toValidate(metatype)) {
//       return value;
//     }
//     if (!value) {
//       throw new BadRequestException('No data submitted');
//     }
//     if (type === 'query') value = this.transformQuery(value);
//     const object = plainToClass(metatype)
//   }
//   private toValidate(metatype): boolean {
//     const types = [String, Boolean, Number, Array, Object];
//     return !types.find((type) => metatype === type);
//   }

//   transformQuery(query: any) {
//     if (typeof query !== 'object') return query;

//     let { filter, sort } = query;
//     if (filter) filter = filter.replace(/\\/g, '');
//     if (isJson(filter)) {
//       const decodedData = decodeURIComponent(filter);
//       query.filter = JSON.parse(decodedData);
//     }

//     if (sort) sort = sort.replace(/\\/g, '');
//     if (isJson(sort)) {
//       const decodedData = decodeURIComponent(sort);
//       query.sort = JSON.parse(decodedData);
//     }

//     return query;
//   }
// }
