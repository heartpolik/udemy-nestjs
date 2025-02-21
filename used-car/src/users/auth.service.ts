import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(data: CreateUserDto) {
    const user = await this.usersService.findOneBy({ email: data.email });
    if (user) {
      throw new BadRequestException('user already exists');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(data.password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;

    return this.usersService.create({ ...data, password: result });
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, hash] = user.password.split('.');
    const hashBuffer = Buffer.from(hash, 'hex');
    const key = (await scrypt(password, salt, 32)) as Buffer;
    if (hashBuffer.toString('hex') !== key.toString('hex')) {
      throw new UnauthorizedException('invalid credentials');
    }
    return user;
  }
}
