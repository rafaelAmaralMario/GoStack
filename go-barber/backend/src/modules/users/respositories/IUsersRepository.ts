import User from '@modules/users/infra/typeorm/entities/User';
import UserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  create(user: UserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
