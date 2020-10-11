import 'reflect-metadata';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmetsRepository from '@modules/appointments/repositories/fakes/FakeAppointmetsRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmetsRepository = new FakeAppointmetsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmetsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1');
  });

  it('should not be able to create a two appointments on the same time', async () => {
    const fakeAppointmetsRepository = new FakeAppointmetsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmetsRepository,
    );

    const date = new Date();
    const provider_id = '1';

    await createAppointment.execute({
      date,
      provider_id,
    });

    await expect(
      createAppointment.execute({
        date,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
