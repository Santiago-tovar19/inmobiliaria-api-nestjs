import { Appointment } from '../entitites/appointment.entity';

export class AppointmentResource {
  static make(appointment: Appointment) {
    return {
      id: appointment.id,
      property_id: appointment.propertyId,
      email: appointment.email,
      phone: appointment.phone,
      message: appointment.message,
      day_of_week: appointment.dayOfWeek,
      created_at: appointment.createdAt,
      updated_at: appointment.updatedAt,
      property: appointment.property ?? null,
    };
  }

  static collection(appointments: Appointment[]) {
    return appointments.map((a) => this.make(a));
  }
}
