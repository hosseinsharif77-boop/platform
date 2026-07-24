/**
 * Soft Delete Plugin
 * 
 * Adds soft delete functionality to Mongoose schemas.
 * Documents are marked as deleted rather than removed.
 */

import { Schema, Document, CallbackWithoutResultAndOptionalError } from 'mongoose';

export interface SoftDeleteDocument extends Document {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: any;
}

export interface SoftDeleteModel<T extends Document> {
  findActive(filter?: any): any;
  findOneActive(filter?: any): any;
  deleteById(id: string, userId?: string): Promise<T | null>;
  restoreById(id: string): Promise<T | null>;
}

/**
 * Soft delete plugin adds isDeleted, deletedAt, deletedBy fields
 * and provides methods for querying active documents
 */
export function softDeletePlugin(schema: Schema): void {
  // Add soft delete fields
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  });

  // Create partial index for active documents
  schema.index({ isDeleted: 1 }, { partialFilterExpression: { isDeleted: false } });

  // Static method to find active documents
  schema.statics.findActive = function (filter: any = {}) {
    return this.find({ ...filter, isDeleted: false });
  };

  // Static method to find one active document
  schema.statics.findOneActive = function (filter: any = {}) {
    return this.findOne({ ...filter, isDeleted: false });
  };

  // Static method to soft delete by ID
  schema.statics.deleteById = async function (id: string, userId?: string) {
    return this.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
      { new: true }
    );
  };

  // Static method to restore soft deleted document
  schema.statics.restoreById = async function (id: string) {
    return this.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
      },
      { new: true }
    );
  };

  // Pre-find hook to exclude deleted documents by default
  schema.pre(/^find/, function (next: CallbackWithoutResultAndOptionalError) {
    // Only apply if not explicitly querying deleted documents
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: { $ne: true } });
    }
    next();
  });

  // Pre findOne hook
  schema.pre('findOne', function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: { $ne: true } });
    }
    next();
  });

  // Pre count hook
  schema.pre('count', function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: { $ne: true } });
    }
    next();
  });

  // Pre countDocuments hook
  schema.pre('countDocuments', function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: { $ne: true } });
    }
    next();
  });
}

export default softDeletePlugin;
