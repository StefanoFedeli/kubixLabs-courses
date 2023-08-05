import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './auth-user.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
