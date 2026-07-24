/**
 * Brand Schema
 * 
 * Brand management for product categorization.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface IBrand extends AuditDocument, SoftDeleteDocument {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  productCount: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  metadata: Record<string, any>;
}

export interface BrandModel extends Model<IBrand> {
  findBySlug(slug: string): Promise<IBrand | null>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const brandSchema = new Schema<IBrand, BrandModel>({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  logo: {
    type: String,
  },
  website: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  productCount: {
    type: Number,
    default: 0,
  },
  seo: {
    title: { type: String, maxlength: 60 },
    description: { type: String, maxlength: 160 },
    keywords: [{ type: String }],
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'brands',
});

// ===========================================
// INDEXES
// ===========================================

brandSchema.index({ name: 'text', description: 'text' });
brandSchema.index({ isActive: 1 });

// ===========================================
// STATIC METHODS
// ===========================================

brandSchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug, isDeleted: false });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

brandSchema.plugin(auditPlugin);
brandSchema.plugin(softDeletePlugin);
brandSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const Brand = Model.model<IBrand, BrandModel>('Brand', brandSchema);
export default Brand;
