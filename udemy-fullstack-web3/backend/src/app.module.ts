import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { BadgesModule } from './badges/badges.module';

@Module({
  imports: [
    UsersModule,
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BadgesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
