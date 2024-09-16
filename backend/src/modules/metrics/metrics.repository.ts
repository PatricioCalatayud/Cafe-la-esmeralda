import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge, Histogram } from 'prom-client';

@Injectable()
export class OrdersMetricsRepository {
  constructor(
    @InjectMetric('orders_total') public ordersTotalMetric: Counter<string>,
    @InjectMetric('orders_value') public ordersValueMetric: Gauge<string>,
    @InjectMetric('order_completion_time') public orderCompletionTimeMetric: Histogram<string>,
  ) {}

  async incrementOrdersTotal() {
    return await this.ordersTotalMetric.inc();
  }

  async setOrdersValue(value: number) {
    return await this.ordersValueMetric.set(value);
  }

  async observeOrderCompletionTime(time: number) {
    return await this.orderCompletionTimeMetric.observe(time);
  }
}