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
    const startDate = new Date(`${date.substring(0, 10)}T${time}:00`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const qrText = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(service)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent("Cita reservada por " + clientName)}`;
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
      from: '"CitasApp" <no-reply@citasapp.com>',
      to: email,
      subject: "Confirmación de tu cita y Código QR",
      html: `
        <h2>¡Hola ${clientName}!</h2>
        <p>Tu cita para <b>${service}</b> ha sido confirmada.</p>
        <p><b>Fecha:</b> ${date.substring(0, 10)}</p>
        <p><b>Hora:</b> ${time}</p>
        <p>Escanea este código QR con la cámara de tu celular para agregarlo a tu agenda de Google Calendar:</p>
        
       
        <div style="text-align: center; margin: 20px 0;">
          <img src="cid:codigoqr" alt="QR Code" style="width: 200px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
        </div>
      `,
      attachments: [
        {
          filename: 'tu-codigo-qr.png',
          path: qrImage,
          cid: 'codigoqr'
        }
      ]
    });


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


export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { clientName, service, date, time, email, status } = req.body;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    if (clientName !== undefined) appointment.clientName = clientName;
    if (service !== undefined) appointment.service = service;
    if (date !== undefined) appointment.date = new Date(date);
    if (time !== undefined) appointment.time = time;
    if (email !== undefined) appointment.email = email.toLowerCase();
    if (status !== undefined) appointment.status = status;
    await appointment.save();
    try {
      const dateStr = typeof appointment.date === 'string' ? appointment.date : appointment.date.toISOString();
      const startDate = new Date(`${dateStr.substring(0, 10)}T${appointment.time}:00`);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const qrText = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(appointment.service)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent("Cita reservada por " + appointment.clientName)}`;
      const qrImage = await QRCode.toDataURL(qrText);
      if (!testAccountCache) {
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
        from: '"CitasApp" <no-reply@citasapp.com>',
        to: appointment.email,
        subject: "Actualización de tu cita y Código QR",
        html: `
          <h2>¡Hola ${appointment.clientName}!</h2>
          <p>Tu cita para <b>${appointment.service}</b> ha sido <b>actualizada</b> con éxito.</p>
          <p><b>Nueva Fecha:</b> ${dateStr.substring(0, 10)}</p>
          <p><b>Nueva Hora:</b> ${appointment.time}</p>
          <p>Escanea este nuevo código QR para actualizar la cita en tu Google Calendar:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <img src="cid:codigoqr" alt="QR Code" style="width: 200px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
          </div>
        `,
        attachments: [
          {
            filename: 'tu-codigo-qr.png',
            path: qrImage,
            cid: 'codigoqr'
          }
        ]
      });
      console.log("¡Correo de actualización enviado! Ver en: %s", nodemailer.getTestMessageUrl(info));
    } catch (mailError) {
      console.error("Error al enviar el correo de actualización:", mailError);
    }
    res.json(appointment);
  } catch (error: any) {
    console.error("Error al actualizar la cita:", error);
    res.status(500).json({ message: 'Error updating appointment', detail: error.message });
  }
};