/**
 * StoreMember Schema
 * 
 * Manages store membership and role-based access control.
 * Supports multiple members per store with different roles.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum StoreMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum StoreMemberStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  SUSPENDED = 'suspended',
}

export interface IStoreMember extends AuditDocument, SoftDeleteDocument {
  storeId: any;
  userId: any;
  role: StoreMemberRole;
  status: StoreMemberStatus;
  invitedAt?: Date;
  invitedBy?: any;
  acceptedAt?: Date;
  permissions: string[];
  metadata: Record<string, any>;
  
  // Virtuals
  store?: any;
  user?: any;
}

export interface StoreMemberModel extends Model<IStoreMember> {
  findByStore(storeId: string): Promise<IStoreMember[]>;
  findByUser(userId: string): Promise<IStoreMember[]>;
  findByStoreAndUser(storeId: string, userId: string): Promise<IStoreMember | null>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const storeMemberSchema = new Schema<IStoreMember, StoreMemberModel>({
  // Relationships
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Role & Status
  role: {
    type: String,
    enum: Object.values(StoreMemberRole),
    default: StoreMemberRole.VIEWER,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(StoreMemberStatus),
    default: StoreMemberStatus.INVITED,
    required: true,
  },

  // Invitation tracking
  invitedAt: {
    type: Date,
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  acceptedAt: {
    type: Date,
  },

  // Granular permissions
  permissions: [{
    type: String,
    trim: true,
  }],

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'store_members',
});

// ===========================================
// VIRTUALS
// ===========================================

storeMemberSchema.virtual('store', {
  ref: 'Store',
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});

storeMemberSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// ===========================================
// INDEXES
// ===========================================

// Unique constraint: one membership per user per store
storeMemberSchema.index(
  { storeId: 1, userId: 1 },
  { unique: true }
);

// Query patterns
storeMemberSchema.index({ storeId: 1, role: 1 });
storeMemberSchema.index({ userId: 1, status: 1 });
storeMemberSchema.index({ invitedAt: 1 }, { sparse: true });

// ===========================================
// STATIC METHODS
// ===========================================

storeMemberSchema.statics.findByStore = function (storeId: string) {
  return this.find({ storeId, isDeleted: false }).populate('userId', 'firstName lastName email avatar');
};

storeMemberSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId, isDeleted: false }).populate('storeId', 'name slug logo');
};

storeMemberSchema.statics.findByStoreAndUser = function (storeId: string, userId: string) {
  return this.findOne({ storeId, userId, isDeleted: false });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

storeMemberSchema.plugin(auditPlugin);
storeMemberSchema.plugin(softDeletePlugin);
storeMemberSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const StoreMember = Model.model<IStoreMember, StoreMemberModel>(
  'StoreMember',
  storeMemberSchema
);
export default StoreMember;
