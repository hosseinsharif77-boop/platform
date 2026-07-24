/**
 * Settings Schemas
 * 
 * System and store configuration schemas.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface ISystemSettings extends AuditDocument {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description?: string;
  isPublic: boolean;
  category: string;
  metadata: Record<string, any>;
}

export interface IStoreSettings extends AuditDocument {
  storeId: any;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description?: string;
  metadata: Record<string, any>;
}

export interface SystemSettingsModel extends Model<ISystemSettings> {
  get(key: string): Promise<any>;
  set(key: string, value: any, options?: Partial<ISystemSettings>): Promise<ISystemSettings>;
  getByCategory(category: string): Promise<ISystemSettings[]>;
  getPublic(): Promise<ISystemSettings[]>;
}

export interface StoreSettingsModel extends Model<IStoreSettings> {
  get(storeId: string, key: string): Promise<any>;
  set(storeId: string, key: string, value: any): Promise<IStoreSettings>;
  getAll(storeId: string): Promise<IStoreSettings[]>;
}

// ===========================================
// SYSTEM SETTINGS SCHEMA
// ===========================================

const systemSettingsSchema = new Schema<ISystemSettings, SystemSettingsModel>({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'json', 'array'],
    default: 'string',
  },
  description: {
    type: String,
    maxlength: 500,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'system_settings',
});

// Indexes
systemSettingsSchema.index({ category: 1 });
systemSettingsSchema.index({ isPublic: 1 });

// Static methods
systemSettingsSchema.statics.get = async function (key: string) {
  const setting = await this.findOne({ key });
  return setting?.value;
};

systemSettingsSchema.statics.set = function (
  key: string,
  value: any,
  options: Partial<ISystemSettings> = {}
) {
  return this.findOneAndUpdate(
    { key },
    { key, value, ...options },
    { upsert: true, new: true }
  );
};

systemSettingsSchema.statics.getByCategory = function (category: string) {
  return this.find({ category }).sort({ key: 1 });
};

systemSettingsSchema.statics.getPublic = function () {
  return this.find({ isPublic: true }).sort({ key: 1 });
};

// Apply plugins
systemSettingsSchema.plugin(auditPlugin);
systemSettingsSchema.plugin(toJSONPlugin);

// ===========================================
// STORE SETTINGS SCHEMA
// ===========================================

const storeSettingsSchema = new Schema<IStoreSettings, StoreSettingsModel>({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
  key: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'json', 'array'],
    default: 'string',
  },
  description: {
    type: String,
    maxlength: 500,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'store_settings',
});

// Indexes
storeSettingsSchema.index({ storeId: 1, key: 1 }, { unique: true });

// Static methods
storeSettingsSchema.statics.get = async function (storeId: string, key: string) {
  const setting = await this.findOne({ storeId, key });
  return setting?.value;
};

storeSettingsSchema.statics.set = function (storeId: string, key: string, value: any) {
  return this.findOneAndUpdate(
    { storeId, key },
    { storeId, key, value },
    { upsert: true, new: true }
  );
};

storeSettingsSchema.statics.getAll = function (storeId: string) {
  return this.find({ storeId }).sort({ key: 1 });
};

// Apply plugins
storeSettingsSchema.plugin(auditPlugin);
storeSettingsSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODELS
// ===========================================

export const SystemSettings = Model.model<ISystemSettings, SystemSettingsModel>(
  'SystemSettings',
  systemSettingsSchema
);

export const StoreSettings = Model.model<IStoreSettings, StoreSettingsModel>(
  'StoreSettings',
  storeSettingsSchema
);

export default { SystemSettings, StoreSettings };
