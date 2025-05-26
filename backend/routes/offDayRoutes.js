import express from 'express';
import { getOffDays, createOffDay, updateOffDay, deleteOffDay } from '../controllers/offDayController.js';

const offDayRouter = express.Router();
offDayRouter.get('/', getOffDays);
offDayRouter.post('/', createOffDay);
offDayRouter.put('/:id', updateOffDay);
offDayRouter.delete('/:id', deleteOffDay);

export default offDayRouter;