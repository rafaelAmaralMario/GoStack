import 'reflect-metadata';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';

import FakeUsersRepository from '@modules/users/respositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });

  it('should be able to Authenticate the user', async () => {
    await createUser.execute({
      email: 'r@mail.com',
      name: 'test',
      password: '123456',
    });

    const authentication = await authenticateUser.execute({
      email: 'r@mail.com',
      password: '123456',
    });

    expect(authentication).toHaveProperty('token');
  });

  it('should not be able to Authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'ra@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to Authenticate with wrong password', async () => {
    await createUser.execute({
      email: 'r@mail.com',
      password: '123456',
      name: 'test',
    });

    await expect(
      authenticateUser.execute({
        email: 'r@mail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
