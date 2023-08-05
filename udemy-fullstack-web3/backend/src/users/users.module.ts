import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from '../config/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    DrizzleModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: '1000 years' },
    })],
})
export class UsersModule {
}
