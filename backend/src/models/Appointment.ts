import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  clientName: string;
  service: string;
  email: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const appointmentSchema = new Schema<IAppointment>({
  clientName: { type: String, required: true },
  service: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
