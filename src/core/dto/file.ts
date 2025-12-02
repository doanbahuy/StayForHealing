export class File {
  data: any;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size?: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
  stream?: NodeJS.ReadableStream;
}
