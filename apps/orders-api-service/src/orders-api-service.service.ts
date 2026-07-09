import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersApiServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
