import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';


export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// Guardamos la cuenta de prueba en la memoria del servidor para que solo tarde la primera vez
let testAccountCache: any = null;

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { clientName, service, date, time, email } = req.body;
    const newAppointment = new Appointment({ clientName, service, date, time, email });
    await newAppointment.save();
    const qrText = `Cita Confirmada\nCliente: ${clientName}\nServicio: ${service}\nFecha: ${date.substring(0, 10)}\nHora: ${time}`;
    const qrImage = await QRCode.toDataURL(qrText);

    // Si no tenemos cuenta, la creamos (tarda un poco). Si ya tenemos, la usamos (instantáneo).
    if (!testAccountCache) {
      console.log("Creando cuenta de correo de prueba (puede tardar unos segundos)...");
      testAccountCache = await nodemailer.createTestAccount();
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccountCache.user,
        pass: testAccountCache.pass,
      },
    });
    const info = await transporter.sendMail({
      from: '"CitasApp" <no-reply@citasapp.com>', // Quien lo envía
      to: email, // El correo del cliente
      subject: "Confirmación de tu cita y Código QR",
      text: "Hola, aquí tienes los detalles de tu cita y tu código QR adjunto.",
      html: `
        <h2>¡Hola ${clientName}!</h2>
        <p>Tu cita para <b>${service}</b> ha sido confirmada.</p>
        <p><b>Fecha:</b> ${date.substring(0, 10)}</p>
        <p><b>Hora:</b> ${time}</p>
        <p>Adjunto encontrarás tu código QR para el día de la cita.</p>
      `,
      attachments: [
        {
          filename: 'tu-codigo-qr.png',
          path: qrImage // Aquí pegamos la imagen que creamos en la Pieza 2
        }
      ]
    });
    // 8. Imprimimos en la consola el enlace mágico para ver el correo
    console.log("¡Correo enviado! Haz clic aquí para verlo: %s", nodemailer.getTestMessageUrl(info));
    // 9. Le decimos al frontend que terminamos con éxito
    res.status(201).json(newAppointment);
  } catch (error: any) {
    console.error("DETALLE DEL ERROR:", error);
    res.status(500).json({ message: 'Error creating appointment', detail: error.message });
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