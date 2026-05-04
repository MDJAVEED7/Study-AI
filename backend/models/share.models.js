import mongoose from 'mongoose';
import crypto from 'crypto';

const shareSchema = new mongoose.Schema(
  {
    shareToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    resourceType: {
      type: String,
      enum: ['quiz', 'flashcard'],
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

shareSchema.index({ userId: 1, createdAt: -1 });
shareSchema.index({ resourceType: 1, resourceId: 1 });

const Share = mongoose.model('Share', shareSchema);
export default Share;
