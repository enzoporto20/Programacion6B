import pcgamer from './pcgamer.routes.js';
import { Router } from 'express';
const indexroutes = Router();

indexroutes.use('/pcgamers', pcgamer);

export default indexroutes;
