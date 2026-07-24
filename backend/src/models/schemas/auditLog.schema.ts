/**
 * Audit & Activity Log Schemas
 * 
 * System audit trail and user activity logging.
 */

import { Schema, Document, Model } from 'mongoose';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  IMPORT = 'import',
}

export interface IAuditLog extends Document {
  userId?: any;
  storeId?: any;
  action: AuditAction;
  entity: string;
  entityId?: any;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface IActivityLog extends Document {
  userId?: any;
  storeId?: any;
  action: string;
  entity: string;
  entityId?: any;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface AuditLogModel extends Model<IAuditLog> {
  log(params: Partial<IAuditLog>): Promise<IAuditLog>;
  findByEntity(entity: string, entityId: string): Promise<IAuditLog[]>;
  findByUser(userId: string, limit?: number): Promise<IAuditLog[]>;
}

export interface ActivityLogModel extends Model<IActivityLog> {
  log(params: Partial<IActivityLog>): Promise<IActivityLog>;
  findByUser(userId: string, limit?: number): Promise<IActivityLog[]>;
}

// ===========================================
// AUDIT LOG SCHEMA
// ===========================================

const auditLogSchema = new Schema<IAuditLog, AuditLogModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    sparse: true,
    index: true,
  },

  // Action details
  action: {
    type: String,
    enum: Object.values(AuditAction),
    required: true,
    index: true,
  },
  entity: {
    type: String,
    required: true,
    index: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    sparse: true,
    index: true,
  },

  // Changes (for updates)
  changes: [{
    field: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
  }],

  // Context
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'audit_logs',
});

// Indexes
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ userId: 1, action: 1, createdAt: -1 });
auditLogSchema.index({ storeId: 1, action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }); // 1 year TTL

// Static methods
auditLogSchema.statics.log = function (params: Partial<IAuditLog>) {
  return this.create(params);
};

auditLogSchema.statics.findByEntity = function (entity: string, entityId: string) {
  return this.find({ entity, entityId }).sort({ createdAt: -1 });
};

auditLogSchema.statics.findByUser = function (userId: string, limit = 100) {
  return this.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};

// Apply plugins
auditLogSchema.plugin(toJSONPlugin);

// ===========================================
// ACTIVITY LOG SCHEMA
// ===========================================

const activityLogSchema = new Schema<IActivityLog, ActivityLogModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    sparse: true,
    index: true,
  },

  // Action details
  action: {
    type: String,
    required: true,
    index: true,
  },
  entity: {
    type: String,
    required: true,
    index: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    sparse: true,
  },

  // Additional details
  details: {
    type: Schema.Types.Mixed,
  },

  // Context
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'activity_logs',
});

// Indexes
activityLogSchema.index({ entity: 1, entityId: 1 });
activityLogSchema.index({ userId: 1, action: 1, createdAt: -1 });
activityLogSchema.index({ storeId: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90 days TTL

// Static methods
activityLogSchema.statics.log = function (params: Partial<IActivityLog>) {
  return this.create(params);
};

activityLogSchema.statics.findByUser = function (userId: string, limit = 100) {
  return this.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};

// Apply plugins
activityLogSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODELS
// ===========================================

export const AuditLog = Model.model<IAuditLog, AuditLogModel>('AuditLog', auditLogSchema);
export const ActivityLog = Model.model<IActivityLog, ActivityLogModel>(
  'ActivityLog',
  activityLogSchema
);

export default { AuditLog, ActivityLog };
