import 'reflect-metadata';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import FakeUsersRepository from '@modules/users/respositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfile: UpdateUserProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserProfile = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the Profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'rafael@mai.com',
      name: 'rafael',
      password: 'rafael-pass',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      email: 'rafael@mail.com',
      name: 'Rafael Mario',
    });

    expect(updatedUser.name).toBe('Rafael Mario');
    expect(updatedUser.email).toBe('rafael@mail.com');
  });

  it('should not be able to update the Profile for an invalid user id', async () => {
    await expect(
      updateUserProfile.execute({
        user_id: '123',
        email: 'rafael@mai.com',
        name: 'Rafael Mario',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the Profile email for an existent email', async () => {
    await fakeUsersRepository.create({
      email: 'rafael@mai.com',
      name: 'rafael',
      password: 'rafael-pass',
    });

    const user = await fakeUsersRepository.create({
      email: 'rafael2@mai.com',
      name: 'rafael',
      password: 'rafael-pass',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        email: 'rafael@mai.com',
        name: 'Rafael Mario',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'rafael@mai.com',
      name: 'rafael',
      password: 'rafael-pass',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      email: 'rafael@mail.com',
      name: 'Rafael Mario',
      old_password: 'rafael-pass',
      password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'rafael@mai.com',
      name: 'rafael',
      password: 'rafael-pass',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        email: 'rafael@mail.com',
        name: 'Rafael Mario',
        old_password: '',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'rafael@mai.com',
      name: 'rafael',
      password: 'rafael-pass',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        email: 'rafael@mail.com',
        name: 'Rafael Mario',
        old_password: 'wrong-old-password',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
