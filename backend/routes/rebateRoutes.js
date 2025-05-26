import express from 'express';
import { getRebates, createRebate, updateRebate, deleteRebate } from '../controllers/rebateController.js';

const rebateRouter = express.Router();
rebateRouter.get('/', getRebates);
rebateRouter.post('/', createRebate);
rebateRouter.put('/:id', updateRebate);
rebateRouter.delete('/:id', deleteRebate);

export default rebateRouter;