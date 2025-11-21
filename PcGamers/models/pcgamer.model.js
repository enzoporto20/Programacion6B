import mongoose from "mongoose";

const PcGamerSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: [true, 'La marca es obligatoria']
  },
  modelo: {
    type: String,
    required: [true, 'El modelo es obligatorio']
  },
  cpu: {
    type: String,
    required: false
  },
  gpu: {
    type: String,
    required: false
  },
  ramGB: {
    type: Number,
    required: true,
    min: [4, 'La RAM debe ser al menos 4GB']
  },
  almacenamiento: {
    type: String,
    required: false // ej. "1TB SSD"
  },
  precioUSD: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo']
  },
  disponible: {
    type: Boolean,
    default: true
  },
  fecha_lanzamiento: {
    type: Date,
    required: false
  },
  extras: {
    type: [String],
    required: false
  }
}, {
  timestamps: true
});

const PcGamer = mongoose.model('PcGamer', PcGamerSchema);

export default PcGamer;
