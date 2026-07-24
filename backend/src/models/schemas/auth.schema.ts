/**
 * Auth Schemas
 * 
 * Authentication-related schemas including:
 * - Session: User session management
 * - RefreshToken: JWT refresh token management
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface ISession extends Document {
  userId: any;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: Date;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRefreshToken extends Document {
  userId: any;
  token: string;
  family: string; // Token family for rotation detection
  ipAddress?: string;
  userAgent?: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface SessionModel extends Model<ISession> {
  findActiveByUser(userId: string): Promise<ISession[]>;
  revokeAll(userId: string): Promise<void>;
  cleanupExpired(): Promise<void>;
}

export interface RefreshTokenModel extends Model<IRefreshToken> {
  findByToken(token: string): Promise<IRefreshToken | null>;
  findActiveByUser(userId: string): Promise<IRefreshToken[]>;
  revokeFamily(family: string): Promise<void>;
  cleanupExpired(): Promise<void>;
}

// ===========================================
// SESSION SCHEMA
// ===========================================

const sessionSchema = new Schema<ISession, SessionModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  lastActivityAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'sessions',
});

// Indexes
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Static methods
sessionSchema.statics.findActiveByUser = function (userId: string) {
  return this.find({
    userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
};

sessionSchema.statics.revokeAll = function (userId: string) {
  return this.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
};

sessionSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false },
    ],
  });
};

// Apply plugins
sessionSchema.plugin(auditPlugin);
sessionSchema.plugin(toJSONPlugin);

// ===========================================
// REFRESH TOKEN SCHEMA
// ===========================================

const refreshTokenSchema = new Schema<IRefreshToken, RefreshTokenModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  family: {
    type: String,
    required: true,
    index: true,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  isRevoked: {
    type: Boolean,
    default: false,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'refresh_tokens',
});

// Indexes
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });
refreshTokenSchema.index({ family: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Static methods
refreshTokenSchema.statics.findByToken = function (token: string) {
  return this.findOne({ token, isRevoked: false });
};

refreshTokenSchema.statics.findActiveByUser = function (userId: string) {
  return this.find({
    userId,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });
};

refreshTokenSchema.statics.revokeFamily = function (family: string) {
  return this.updateMany(
    { family },
    { isRevoked: true }
  );
};

refreshTokenSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isRevoked: true },
    ],
  });
};

// Apply plugins
refreshTokenSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODELS
// ===========================================

export const Session = Model.model<ISession, SessionModel>('Session', sessionSchema);
export const RefreshToken = Model.model<IRefreshToken, RefreshTokenModel>(
  'RefreshToken',
  refreshTokenSchema
);

export default { Session, RefreshToken };
