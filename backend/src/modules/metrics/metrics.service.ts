import { Injectable } from '@nestjs/common';
import { OrdersMetricsRepository } from './metrics.repository';

@Injectable()
export class OrdersMetricsService {
  constructor(
    private readonly ordersMetricsRepository: OrdersMetricsRepository,
  ) {}

  incrementOrdersTotal() {
    return this.ordersMetricsRepository.incrementOrdersTotal();
  }

  setOrdersValue(value: number) {
    if (!value) throw new Error('Value es obligatorio');
    return this.ordersMetricsRepository.setOrdersValue(value);
}

  observeOrderCompletionTime(time: number) {
    if (!time) throw new Error('Time es obligatorio');
    return this.ordersMetricsRepository.observeOrderCompletionTime(time);
}


}