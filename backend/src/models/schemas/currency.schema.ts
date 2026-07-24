/**
 * Currency Schemas
 * 
 * Multi-currency support with exchange rates.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface ICurrency extends Document {
  code: string; // ISO 4217 (USD, EUR, IRR)
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExchangeRate extends Document {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  source: string;
  timestamp: Date;
  createdAt: Date;
}

export interface CurrencyModel extends Model<ICurrency> {
  findByCode(code: string): Promise<ICurrency | null>;
  getDefault(): Promise<ICurrency | null>;
  getActive(): Promise<ICurrency[]>;
}

export interface ExchangeRateModel extends Model<IExchangeRate> {
  getRate(from: string, to: string): Promise<number>;
  getLatestRates(baseCurrency: string): Promise<IExchangeRate[]>;
}

// ===========================================
// CURRENCY SCHEMA
// ===========================================

const currencySchema = new Schema<ICurrency, CurrencyModel>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    maxlength: 3,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  symbolPosition: {
    type: String,
    enum: ['before', 'after'],
    default: 'before',
  },
  decimalPlaces: {
    type: Number,
    default: 2,
    min: 0,
    max: 4,
  },
  thousandsSeparator: {
    type: String,
    default: ',',
  },
  decimalSeparator: {
    type: String,
    default: '.',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'currencies',
});

// Static methods
currencySchema.statics.findByCode = function (code: string) {
  return this.findOne({ code: code.toUpperCase() });
};

currencySchema.statics.getDefault = function () {
  return this.findOne({ isDefault: true, isActive: true });
};

currencySchema.statics.getActive = function () {
  return this.find({ isActive: true }).sort({ code: 1 });
};

// Apply plugins
currencySchema.plugin(toJSONPlugin);

// ===========================================
// EXCHANGE RATE SCHEMA
// ===========================================

const exchangeRateSchema = new Schema<IExchangeRate, ExchangeRateModel>({
  fromCurrency: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 3,
  },
  toCurrency: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 3,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  source: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'exchange_rates',
});

// Indexes
exchangeRateSchema.index({ fromCurrency: 1, toCurrency: 1, timestamp: -1 });
exchangeRateSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }); // 1 year TTL

// Static methods
exchangeRateSchema.statics.getRate = async function (from: string, to: string) {
  if (from === to) return 1;
  
  const rate = await this.findOne({
    fromCurrency: from.toUpperCase(),
    toCurrency: to.toUpperCase(),
  }).sort({ timestamp: -1 });
  
  return rate?.rate || 1;
};

exchangeRateSchema.statics.getLatestRates = function (baseCurrency: string) {
  return this.aggregate([
    { $match: { fromCurrency: baseCurrency.toUpperCase() } },
    { $sort: { timestamp: -1 } },
    { $group: { _id: '$toCurrency', rate: { $first: '$rate' }, timestamp: { $first: '$timestamp' } } },
  ]);
};

// Apply plugins
exchangeRateSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODELS
// ===========================================

export const Currency = Model.model<ICurrency, CurrencyModel>('Currency', currencySchema);
export const ExchangeRate = Model.model<IExchangeRate, ExchangeRateModel>(
  'ExchangeRate',
  exchangeRateSchema
);

export default { Currency, ExchangeRate };
