import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { clientName, service, date, time } = req.body;
    const newAppointment = new Appointment({ clientName, service, date, time });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment' });
  }
};

export const deleteAppointment = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    
    if (!deletedAppointment) {
      return response.status(404).json({ message: 'Cita no encontrada' });
    }
    
    response.json({ message: 'Cita eliminada correctamente', deletedAppointment });
  } catch (error) {
    response.status(500).json({ message: 'Error al eliminar la cita' });
  }
};