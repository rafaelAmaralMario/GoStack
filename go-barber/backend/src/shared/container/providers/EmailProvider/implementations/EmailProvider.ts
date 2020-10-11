import fs from 'fs';
import path from 'path';

import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';

import uploadConfig from '@config/upload';

class EmailProvider implements IEmailProvider {
  public async sendMail(to: string, body: string): Promise<void> {}
}

export default EmailProvider;
