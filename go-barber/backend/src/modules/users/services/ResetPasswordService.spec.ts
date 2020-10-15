import 'reflect-metadata';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeUsersRepository from '@modules/users/respositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '@modules/users/respositories/fakes/FakeUsersTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUsersTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUsersTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password ', async () => {
    let user = await fakeUserRepository.create({
      name: 'Johh Doe',
      email: 'r@mail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({ password: '234567', token });

    user = await fakeUserRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('234567');
    expect(user?.password).toBe('234567');
  });

  it('should not be able to reset the password with an invalid token', async () => {
    await expect(
      resetPassword.execute({ password: '234567', token: '1223454' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password of an invalid user', async () => {
    const { token } = await fakeUserTokensRepository.generate('123456');

    await expect(
      resetPassword.execute({ password: '234567', token }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to reset the password of an invalid user', async () => {
    const { token } = await fakeUserTokensRepository.generate('123456');

    await expect(
      resetPassword.execute({ password: '234567', token }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password after token expires', async () => {
    const user = await fakeUserRepository.create({
      name: 'Johh Doe',
      email: 'r@mail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({ password: '234567', token }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
