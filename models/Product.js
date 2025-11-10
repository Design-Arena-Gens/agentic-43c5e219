import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    previousPrice: { type: Number },
    brand: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['phones', 'laptops', 'tablets', 'audio', 'accessories', 'smart-home', 'wearables']
    },
    image: { type: String },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
