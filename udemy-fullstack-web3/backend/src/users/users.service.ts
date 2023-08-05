import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/auth-user.dto';
import { PG_CONNECTION } from '../drizzle/drizzle.module';
import { authBasic, authMetamask, badges, users } from '../drizzle/schema';
import { v4 as uuidv4 } from 'uuid';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { User } from './entities/user.entity';
import { eq, sql } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PG_CONNECTION) private conn: NodePgDatabase,
    private jwtService: JwtService
  ) {
  }

  async register(createUserDto: RegisterUserDto) {
    // check auth type
    if (!['basic', 'metamask'].includes(createUserDto.authType)) {
      throw new Error('Invalid auth type');
    }
    return await this.conn.transaction(async (tx) => {
      const userId = uuidv4();
      await tx.insert(users).values({
        user_id: userId,
        first_name: createUserDto.firstName,
        last_name: createUserDto.lastName,
        role: createUserDto.role,
        auth_type: createUserDto.authType,
      });
      switch (createUserDto.authType) {
        case 'basic':
          if (!createUserDto.authBasic || !createUserDto.authBasic.username || !createUserDto.authBasic.password) {
            tx.rollback();
            throw new BadRequestException('Missing authBasic attributes');
          }

          await tx.insert(authBasic).values({
            user_id: userId,
            username: createUserDto.authBasic.username,
            password: hashSync(createUserDto.authBasic.password, 10),
          });
          break;
        case 'metamask':
          if (!createUserDto.authMetaMask || !createUserDto.authMetaMask.accountId) {
            tx.rollback();
            throw new BadRequestException('Missing authMetaMask attributes');
          }
          await tx.insert(authMetamask).values({
            user_id: userId,
            account_id: createUserDto.authMetaMask.accountId,
          });
          break;
        default:
          tx.rollback();
          throw new BadRequestException('Invalid auth type');
      }
      return userId;
    });
  }

  async login(loginUserDto: LoginUserDto) {

    // get user data
    let userData = await (async (): Promise<User> => {
      if (loginUserDto.authType === 'basic') {
        const userData = await this.conn
          .select()
          .from(authBasic)
          .innerJoin(users, eq(authBasic.user_id, users.user_id))
          .where(
            sql`username =
            ${loginUserDto.authBasic.username}`)
          .execute();
        if (userData.length === 0) {
          throw new NotFoundException('User not found');
        }
        if (!compareSync(loginUserDto.authBasic.password, userData[0].auth_basic.password)) {
          throw new UnauthorizedException('Invalid password');
        }
        return {
          userId: userData[0].user_details.user_id,
          firstName: userData[0].user_details.first_name,
          lastName: userData[0].user_details.last_name,
          role: userData[0].user_details.role,
        };
      } else if (loginUserDto.authType === 'metamask') {
        const userData = await this.conn
          .select()
          .from(authMetamask)
          .innerJoin(users, eq(authMetamask.user_id, users.user_id))
          .where(
            sql`account_id =
            ${loginUserDto.authMetaMask.accountId}`)
          .execute();
        if (userData.length === 0) {
          throw new NotFoundException('User not found');
        }
        return {
          userId: userData[0].user_details.user_id,
          firstName: userData[0].user_details.first_name,
          lastName: userData[0].user_details.last_name,
          role: userData[0].user_details.role,
        };
      } else {
        throw new BadRequestException('Invalid auth type');
      }
    })();

    return {
      token: this.jwtService.sign({
        userId: userData.userId,
        role: userData.role,
        authType: loginUserDto.authType,
        accountId: loginUserDto.authType === 'metamask' ? loginUserDto.authMetaMask.accountId : null,
        username: loginUserDto.authType === 'basic' ? loginUserDto.authBasic.username : null,
      }),
      user: userData,
    };
  }
}
