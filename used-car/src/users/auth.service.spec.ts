import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const testUser = {
    email: 'correct@users.email',
    password: 'correctPassword',
  };

  beforeEach(async () => {
    const storage: User[] = [];
    const fakeUsersService: Partial<UsersService> = {
      findOneBy: (args) => {
        const res = storage.find((el) => el.email === args.email);
        return Promise.resolve(res);
      },
      create: (data) => {
        const resp: Partial<User> = {
          id: Math.floor(Math.random()) * 1000,
          email: data.email,
          password: data.password,
        };
        storage.push(resp as User);
        return Promise.resolve(resp as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Throws if an invalid password is provided', async () => {
    await service.signup(testUser);
    await expect(
      service.signin(testUser.email, 'wrongPassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('Throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('Throws an error if user signs up with email that is in use', async () => {
    await service.signup(testUser);

    await expect(service.signup(testUser as User)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Return a user if correct password provided', async () => {
    await service.signup(testUser);
    const pulledUser = await service.signin(testUser.email, testUser.password);
    expect(pulledUser).toBeDefined();
  });

  it('Can streate instance of service', async () => {
    expect(service).toBeDefined();
  });

  it('Creating new user', async () => {
    const user = await service.signup(testUser);

    expect(user.password).not.toEqual(testUser.password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
    expect(hash.length).toEqual(64);
  });
});
