import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/respositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import { injectable, inject } from 'tsyringe';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvder: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    const checkUserMail = await this.usersRepository.findByEmail(email);

    if (checkUserMail && checkUserMail.id !== user_id) {
      throw new AppError('Email already in use');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('You need to inform your old password');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvder.compareHash(
        old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new AppError('Wrong old password');
      }

      user.password = await this.hashProvder.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateUserProfileService;
