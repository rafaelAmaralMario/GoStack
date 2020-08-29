import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const checkUserExistis = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExistis) {
      throw Error(`User Already exists: ${email}`);
    }
    const hashsedPassword = await hash(password, 8);
    const user = usersRepository.create({
      name,
      email,
      password: hashsedPassword,
    });

    await usersRepository.save(user);
    return user;
  }
}

export default CreateUserService;