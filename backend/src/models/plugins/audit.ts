/**
 * Audit Plugin
 * 
 * Adds audit trail fields to any Mongoose schema.
 * Tracks who created/modified documents and when.
 */

import { Schema, Document, CallbackWithoutResultAndOptionalError } from 'mongoose';

export interface AuditDocument extends Document {
  createdBy?: any;
  updatedBy?: any;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Audit plugin adds createdAt, updatedAt, createdBy, updatedBy fields
 */
export function auditPlugin(schema: Schema): void {
  // Add timestamp fields
  schema.add({
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  });

  // Pre-save hook to set audit fields
  schema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
    const doc = this as AuditDocument;

    // Set createdAt on new documents
    if (doc.isNew) {
      doc.createdAt = new Date();
    }

    doc.updatedAt = new Date();

    next();
  });

  // Pre-update hook to set updatedAt
  schema.pre(
    ['updateOne', 'updateMany', 'findOneAndUpdate'],
    function (next: CallbackWithoutResultAndOptionalError) {
      this.set({ updatedAt: new Date() });
      next();
    }
  );

  // Ensure timestamps are always present
  schema.set('timestamps', {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
}

export default auditPlugin;
