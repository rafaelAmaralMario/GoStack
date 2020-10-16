import 'reflect-metadata';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeUsersRepository from '@modules/users/respositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to get the Profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'rafael@mai.com',
      name: 'rafael',
      password: 'rafael-pass',
    });

    const updatedUser = await showProfileService.execute({
      user_id: user.id,
    });

    expect(updatedUser.name).toBe('rafael');
    expect(updatedUser.email).toBe('rafael@mai.com');
  });

  it('should not be able to get the Profile with an invalid user id', async () => {
    await expect(
      showProfileService.execute({
        user_id: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
