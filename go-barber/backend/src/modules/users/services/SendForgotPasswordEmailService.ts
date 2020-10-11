import AppError from '@shared/errors/AppError';
// import User from '@modules/users/infra/typeorm/entities/User';

import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';

import IUsersRepository from '@modules/users/respositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/respositories/IUserTokensRepository';

import { injectable, inject } from 'tsyringe';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('EmailProvider')
    private emailProvider: IEmailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError(`User not found`, 401);
    }

    await this.userTokensRepository.generate(user.id);

    this.emailProvider.sendMail(email, 'Forgot Password Mail');
  }
}

export default SendForgotPasswordEmailService;
