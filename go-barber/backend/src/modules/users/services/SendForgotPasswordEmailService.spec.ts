import 'reflect-metadata';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeUsersRepository from '@modules/users/respositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '@modules/users/respositories/fakes/FakeUsersTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUsersTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUsersTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'Johh Doe',
      email: 'r@mail.com',
      password: '123456',
    });
    await sendForgotPasswordEmail.execute({ email: 'r@mail.com' });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover the password for a non-existing user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({ email: 'r@mail.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'Johh Doe',
      email: 'r@mail.com',
      password: '123456',
    });
    await sendForgotPasswordEmail.execute({ email: 'r@mail.com' });

    expect(sendMail).toHaveBeenCalled();
    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
