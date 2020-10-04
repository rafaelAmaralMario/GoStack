import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/respositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExistis = await this.usersRepository.findByEmail(email);

    if (checkUserExistis) {
      throw new AppError(`User Already exists: ${email}`);
    }
    const hashsedPassword = await hash(password, 8);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashsedPassword,
    });

    return user;
  }
}

export default CreateUserService;
