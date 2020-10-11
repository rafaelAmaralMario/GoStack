import { container } from 'tsyringe';

import IStoragePriveder from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IStoragePriveder>(
  'StorageProvider',
  DiskStorageProvider,
);
