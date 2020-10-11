import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/respositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should be able to create a new User', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const newUser = {
      email: 'r@mail.com',
      name: 'test',
      password: '123456',
    };
    const user = await createUser.execute(newUser);
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new User with same email', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const newUser = {
      email: 'r@mail.com',
      name: 'test',
      password: '123456',
    };
    await createUser.execute(newUser);
    await expect(createUser.execute(newUser)).rejects.toBeInstanceOf(AppError);
  });
});
