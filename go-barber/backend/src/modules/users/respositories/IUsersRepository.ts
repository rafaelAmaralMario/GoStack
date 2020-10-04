import User from '@modules/users/infra/typeorm/entities/User';
import UserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findByEmail(id: string): Promise<User | undefined>;
  findById(email: string): Promise<User | undefined>;
  create(user: UserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
