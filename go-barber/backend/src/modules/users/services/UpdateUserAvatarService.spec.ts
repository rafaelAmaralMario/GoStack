import 'reflect-metadata';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '@modules/users/respositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should not be able to update an avatar with user is not authenticated', async () => {
    await expect(
      updateUserAvatar.execute({
        avatarFilename: 'new-avatar.png',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to include an avatar to the user object', async () => {
    const user = await fakeUsersRepository.create({
      email: 'rafael@mai.com',
      name: 'rafael',
      password: 'rafael-pass',
    });

    const upadatedAvatar = await updateUserAvatar.execute({
      avatarFilename: 'new-avatar.png',
      user_id: user.id,
    });

    expect(upadatedAvatar).toHaveProperty('avatar');
    expect(upadatedAvatar.avatar).toBe('new-avatar.png');
  });

  it('should be able to update the user avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      email: 'rafael@mai.com',
      name: 'rafael',
      password: 'rafael-pass',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'new-avatar.png',
      user_id: user.id,
    });

    const upadatedAvatar = await updateUserAvatar.execute({
      avatarFilename: 'another-avatar.png',
      user_id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('new-avatar.png');

    expect(upadatedAvatar).toHaveProperty('avatar');
    expect(upadatedAvatar.avatar).toBe('another-avatar.png');
  });
});
