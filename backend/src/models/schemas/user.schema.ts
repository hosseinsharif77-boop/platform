/**
 * User Schema
 * 
 * Core user model for authentication and authorization.
 * Supports multiple roles and multi-tenancy.
 */

import { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  PASSWORD_RESET_REQUIRED = 'password_reset_required',
}

export interface IUser extends AuditDocument, SoftDeleteDocument {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: Date;
  loginCount: number;
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  metadata: Record<string, any>;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  toPublicJSON(): any;
}

export interface UserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findActiveUsers(filter?: any): Promise<IUser[]>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const userSchema = new Schema<IUser, UserModel>({
  // Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't return password by default
  },

  // Profile
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  phone: {
    type: String,
    trim: true,
    sparse: true,
  },
  avatar: {
    type: String,
  },

  // Authorization
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE,
    required: true,
    index: true,
  },

  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false,
    index: true,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },

  // Activity Tracking
  lastLoginAt: {
    type: Date,
  },
  loginCount: {
    type: Number,
    default: 0,
  },

  // Preferences
  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'fa', 'ar'],
    },
    currency: {
      type: String,
      default: 'USD',
      maxlength: 3,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'users',
});

// ===========================================
// VIRTUAL FIELDS
// ===========================================

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('stores', {
  ref: 'StoreMembers',
  localField: '_id',
  foreignField: 'userId',
});

// ===========================================
// INDEXES
// ===========================================

// Compound indexes for common queries
userSchema.index({ email: 1, status: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLoginAt: -1 }, { sparse: true });

// Text index for search
userSchema.index(
  { firstName: 'text', lastName: 'text', email: 'text' },
  { weights: { firstName: 2, lastName: 2, email: 1 } }
);

// ===========================================
// MIDDLEWARE
// ===========================================

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ===========================================
// METHODS
// ===========================================

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return public user data (no sensitive fields)
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  delete obj.isDeleted;
  delete obj.deletedAt;
  delete obj.deletedBy;
  return obj;
};

// ===========================================
// STATIC METHODS
// ===========================================

userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function (filter: any = {}) {
  return this.find({ ...filter, status: UserStatus.ACTIVE, isDeleted: false });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

userSchema.plugin(auditPlugin);
userSchema.plugin(softDeletePlugin);
userSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const User = UserModel.model<IUser, UserModel>('User', userSchema);
export default User;
