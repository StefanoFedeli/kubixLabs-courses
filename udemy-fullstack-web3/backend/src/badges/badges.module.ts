import { Module } from '@nestjs/common';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { Web3Module } from 'src/web3/web3.module';

@Module({
  imports: [
    DrizzleModule,
    Web3Module,
  ],
  controllers: [BadgesController],
  providers: [BadgesService],
})
export class BadgesModule {
}
