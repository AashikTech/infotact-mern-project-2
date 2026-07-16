import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscount extends Document {
  code: string;
  percentage: number;
  active: boolean;
  expiry: Date;
}

const discountSchema = new Schema<IDiscount>({
  code: {
    type: String,
    required: [true, 'Discount code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  active: {
    type: Boolean,
    default: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

discountSchema.index({ code: 1 });
discountSchema.index({ active: 1, expiry: 1 });

export const Discount = mongoose.model<IDiscount>('Discount', discountSchema);
