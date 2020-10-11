import { container } from 'tsyringe';

import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import EmailProvider from '@shared/container/providers/EmailProvider/implementations/EmailProvider';

container.registerSingleton<IEmailProvider>('EmailProvider', EmailProvider);
