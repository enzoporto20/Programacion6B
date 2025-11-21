import PcGamer from "../models/pcgamer.model.js";
import mongoose from "mongoose";

export const getAllPcGamers = async (req, res) => {
  try {
    const pcs = await PcGamer.find({}, { __v: 0 });
    if (pcs.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron PcGamers' });
    }
    return res.status(200).json({ pcs });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al obtener PcGamers' });
  }
};

export const getPcGamerById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Id no válido' });
    }
    const pc = await PcGamer.findById(id, { __v: 0 });
    if (!pc) {
      return res.status(404).json({ msg: 'PcGamer no encontrado' });
    }
    return res.status(200).json({ pc });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al obtener el PcGamer' });
  }
};

export const postPcGamer = async (req, res) => {
  try {
    const body = req.body;
    const pc = new PcGamer(body);
    const validationError = pc.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(e => e.message);
      return res.status(400).json({ msg: errors });
    }
    await pc.save();
    return res.status(201).json({ pc });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al crear PcGamer' });
  }
};

export const putPcGamer = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Id no válido' });
    }
    const pc = await PcGamer.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!pc) {
      return res.status(404).json({ msg: 'PcGamer no encontrado' });
    }
    return res.status(200).json({ pc });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al actualizar PcGamer' });
  }
};

export const deletePcGamer = async (req, res) => {
  const id = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Id no válido' });
    }
    const pc = await PcGamer.findByIdAndDelete(id);
    if (!pc) {
      return res.status(404).json({ msg: 'PcGamer no encontrado' });
    }
    return res.status(200).json({ msg: 'PcGamer eliminado', pc });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al eliminar PcGamer' });
  }
};
