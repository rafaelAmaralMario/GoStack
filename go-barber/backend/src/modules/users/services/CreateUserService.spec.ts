import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/respositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });

  it('should be able to create a new User', async () => {
    const newUser = {
      email: 'r@mail.com',
      name: 'test',
      password: '123456',
    };
    const user = await createUser.execute(newUser);
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new User with same email', async () => {
    const newUser = {
      email: 'r@mail.com',
      name: 'test',
      password: '123456',
    };
    await createUser.execute(newUser);
    await expect(createUser.execute(newUser)).rejects.toBeInstanceOf(AppError);
  });
});
