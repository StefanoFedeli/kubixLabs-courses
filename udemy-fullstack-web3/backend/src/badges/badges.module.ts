import { Module } from '@nestjs/common';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [
    DrizzleModule,
  ],
  controllers: [BadgesController],
  providers: [BadgesService],
})
export class BadgesModule {
}
