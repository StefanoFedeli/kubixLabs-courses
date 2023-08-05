import {
  Controller,
  Get,
  Post,
  Body,
  Param, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterUserDto) {
    return await this.usersService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }
}
