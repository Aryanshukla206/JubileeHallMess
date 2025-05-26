import express from 'express';
import { getMenu, updateMenu } from '../controllers/menuController.js';

const menuRouter = express.Router();
menuRouter.get('/', getMenu);
menuRouter.put('/', updateMenu);

export default menuRouter;