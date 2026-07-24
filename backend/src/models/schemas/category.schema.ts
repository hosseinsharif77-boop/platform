/**
 * Category Schema
 * 
 * Hierarchical category structure for product organization.
 * Supports unlimited nesting via parent reference.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface ICategory extends AuditDocument, SoftDeleteDocument {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: any;
  ancestors: any[];
  level: number;
  path: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  metadata: Record<string, any>;
  
  // Virtuals
  parent?: any;
  children?: any[];
}

export interface CategoryModel extends Model<ICategory> {
  findBySlug(slug: string): Promise<ICategory | null>;
  findRootCategories(): Promise<ICategory[]>;
  findChildren(parentId: string): Promise<ICategory[]>;
  getCategoryPath(categoryId: string): Promise<ICategory[]>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const categorySchema = new Schema<ICategory, CategoryModel>({
  // Basic info
  name: {
    type: String,
    required: [true, 'Category name is required'],
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
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  image: {
    type: String,
  },

  // Hierarchy
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    sparse: true,
    index: true,
  },
  ancestors: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  level: {
    type: Number,
    default: 0,
    min: 0,
    index: true,
  },
  path: {
    type: String,
    index: true,
  },

  // Display
  sortOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  // Stats
  productCount: {
    type: Number,
    default: 0,
  },

  // SEO
  seo: {
    title: { type: String, maxlength: 60 },
    description: { type: String, maxlength: 160 },
    keywords: [{ type: String }],
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'categories',
});

// ===========================================
// VIRTUALS
// ===========================================

categorySchema.virtual('parent', {
  ref: 'Category',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true,
});

categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
});

// ===========================================
// INDEXES
// ===========================================

categorySchema.index({ parentId: 1, sortOrder: 1 });
categorySchema.index({ ancestors: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1, level: 1 });

// Text search
categorySchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 5 } }
);

// ===========================================
// STATIC METHODS
// ===========================================

categorySchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug, isDeleted: false });
};

categorySchema.statics.findRootCategories = function () {
  return this.find({ parentId: null, isActive: true, isDeleted: false })
    .sort({ sortOrder: 1 });
};

categorySchema.statics.findChildren = function (parentId: string) {
  return this.find({ parentId, isActive: true, isDeleted: false })
    .sort({ sortOrder: 1 });
};

categorySchema.statics.getCategoryPath = async function (categoryId: string) {
  const category = await this.findById(categoryId);
  if (!category) return [];
  
  const pathIds = [...category.ancestors, category._id];
  return this.find({ _id: { $in: pathIds } }).sort({ level: 1 });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

categorySchema.plugin(auditPlugin);
categorySchema.plugin(softDeletePlugin);
categorySchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const Category = Model.model<ICategory, CategoryModel>(
  'Category',
  categorySchema
);
export default Category;
