import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    const forgotEmailService = container.resolve(
      SendForgotPasswordEmailService,
    );
    await forgotEmailService.execute({ email });

    return response.sendStatus(204);
  }
}
