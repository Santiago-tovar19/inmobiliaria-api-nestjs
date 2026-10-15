// dto/create-appointment.dto.ts
export class CreateAppointmentDto {
  propertyId: number;
  email: string;
  phone: string;
  message?: string;
}
