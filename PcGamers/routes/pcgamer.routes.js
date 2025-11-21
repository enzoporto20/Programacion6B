import { Router } from "express";
import {
  getAllPcGamers,
  getPcGamerById,
  postPcGamer,
  putPcGamer,
  deletePcGamer
} from '../controllers/pcgamer.controller.js';

const router = Router();

router.get('/', getAllPcGamers);
router.get('/:id', getPcGamerById);
router.post('/', postPcGamer);
router.put('/:id', putPcGamer);
router.delete('/:id', deletePcGamer);

export default router;
