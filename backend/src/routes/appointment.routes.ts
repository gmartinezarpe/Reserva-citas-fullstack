import { Router } from 'express';
import { getAppointments, createAppointment, deleteAppointment } from '../controllers/appointment.controller';

const router = Router();

router.route('/')
  .get(getAppointments)
  .post(createAppointment)

router.route('/:id')
  .delete(deleteAppointment);

export default router;
