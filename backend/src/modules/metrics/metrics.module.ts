import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { OrdersMetricsService } from './metrics.service';
import { TerminusModule } from '@nestjs/terminus';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';


@Module({
  imports: [TerminusModule,
    PrometheusModule.register(),
  ],
  controllers: [MetricsController],
  providers: [OrdersMetricsService]
})
export class MetricsModule {}