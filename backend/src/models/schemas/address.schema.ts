/**
 * Address Schema
 * 
 * User address management for shipping and billing.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
  BOTH = 'both',
}

export interface IAddress extends AuditDocument, SoftDeleteDocument {
  userId: any;
  type: AddressType;
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  coordinates?: {
    type: string;
    coordinates: number[];
  };
  metadata: Record<string, any>;
}

export interface AddressModel extends Model<IAddress> {
  findByUser(userId: string): Promise<IAddress[]>;
  findDefault(userId: string, type?: AddressType): Promise<IAddress | null>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const addressSchema = new Schema<IAddress, AddressModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: Object.values(AddressType),
    default: AddressType.BOTH,
    index: true,
  },
  label: {
    type: String,
    maxlength: 50,
  },

  // Name
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100,
  },

  // Address
  address1: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  address2: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  state: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2, // ISO 3166-1 alpha-2
    uppercase: true,
  },

  // Contact
  phone: {
    type: String,
    trim: true,
  },

  // Settings
  isDefault: {
    type: Boolean,
    default: false,
    index: true,
  },

  // Geolocation
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'addresses',
});

// ===========================================
// INDEXES
// ===========================================

addressSchema.index({ userId: 1, type: 1 });
addressSchema.index({ userId: 1, isDefault: 1 });
addressSchema.index({ 'coordinates': '2dsphere' }, { sparse: true });

// ===========================================
// STATIC METHODS
// ===========================================

addressSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId, isDeleted: false }).sort({ isDefault: -1, createdAt: -1 });
};

addressSchema.statics.findDefault = function (userId: string, type?: AddressType) {
  const filter: any = { userId, isDefault: true, isDeleted: false };
  if (type) filter.type = { $in: [type, AddressType.BOTH] };
  return this.findOne(filter);
};

// ===========================================
// APPLY PLUGINS
// ===========================================

addressSchema.plugin(auditPlugin);
addressSchema.plugin(softDeletePlugin);
addressSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const Address = Model.model<IAddress, AddressModel>('Address', addressSchema);
export default Address;
