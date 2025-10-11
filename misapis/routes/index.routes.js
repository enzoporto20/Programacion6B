import ejemplo from './ejemplo.routes.js';
import { Router } from 'express';
const indexroutes = Router();

indexroutes.use('/ejemplo', ejemplo);

export default indexroutes;