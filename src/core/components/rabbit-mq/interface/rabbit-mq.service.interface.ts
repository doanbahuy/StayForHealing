export interface IRabbitMqService {
  addToQueue(queueName: string, message: object): Promise<any>;
  createConsumer(queueName: string, callback): Promise<any>;
  close(data: any): Promise<any>;
}
