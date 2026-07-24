/**
 * Notification Schema
 * 
 * User notification management system.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum NotificationType {
  ORDER = 'order',
  PAYMENT = 'payment',
  SHIPPING = 'shipping',
  PRODUCT = 'product',
  REVIEW = 'review',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
  ACCOUNT = 'account',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
}

export interface INotification extends Document {
  userId: any;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface NotificationModel extends Model<INotification> {
  findUnread(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const notificationSchema = new Schema<INotification, NotificationModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
    index: true,
  },
  channel: {
    type: String,
    enum: Object.values(NotificationChannel),
    default: NotificationChannel.IN_APP,
  },

  // Content
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  data: {
    type: Schema.Types.Mixed,
    default: {},
  },

  // Status
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: {
    type: Date,
    sparse: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'notifications',
});

// ===========================================
// INDEXES
// ===========================================

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90 days TTL

// ===========================================
// STATIC METHODS
// ===========================================

notificationSchema.statics.findUnread = function (userId: string) {
  return this.find({ userId, isRead: false }).sort({ createdAt: -1 });
};

notificationSchema.statics.markAsRead = function (notificationId: string) {
  return this.findByIdAndUpdate(
    notificationId,
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

notificationSchema.statics.markAllAsRead = function (userId: string) {
  return this.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

notificationSchema.statics.getUnreadCount = function (userId: string) {
  return this.countDocuments({ userId, isRead: false });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

notificationSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const Notification = Model.model<INotification, NotificationModel>(
  'Notification',
  notificationSchema
);
export default Notification;
