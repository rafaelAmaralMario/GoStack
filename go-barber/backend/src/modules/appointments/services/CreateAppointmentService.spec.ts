import 'reflect-metadata';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmetsRepository from '@modules/appointments/repositories/fakes/FakeAppointmetsRepository';
import AppError from '@shared/errors/AppError';

let fakeAppointmetsRepository: FakeAppointmetsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmetsRepository = new FakeAppointmetsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmetsRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1');
  });

  it('should not be able to create a two appointments on the same time', async () => {
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
