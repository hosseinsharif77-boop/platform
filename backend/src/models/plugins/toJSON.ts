/**
 * ToJSON Plugin
 * 
 * Customizes JSON serialization for Mongoose documents.
 * Removes sensitive fields and transforms output.
 */

import { Schema, Document } from 'mongoose';

/**
 * ToJSON plugin customizes document serialization
 */
export function toJSONPlugin(schema: Schema): void {
  schema.set('toJSON', {
    virtuals: true,
    transform: (doc: Document, ret: any) => {
      // Remove __v
      delete ret.__v;

      // Remove internal fields
      delete ret._id;

      // Remove soft delete fields from JSON output
      delete ret.isDeleted;
      delete ret.deletedAt;
      delete ret.deletedBy;

      // Transform ObjectId to string
      if (ret.createdBy) ret.createdBy = ret.createdBy.toString?.() || ret.createdBy;
      if (ret.updatedBy) ret.updatedBy = ret.updatedBy.toString?.() || ret.updatedBy;

      return ret;
    },
  });

  schema.set('toObject', {
    virtuals: true,
  });
}

export default toJSONPlugin;
