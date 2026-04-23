import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String }], // Up to 4 images
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  type: { type: String, enum: ['single', 'basket'], default: 'single' },
  tags: [{ type: String }],
  basketItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
