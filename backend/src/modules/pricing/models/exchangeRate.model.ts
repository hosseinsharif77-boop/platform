/**
 * Exchange Rate Model
 * 
 * Currency exchange rate storage.
 */

import { Schema, Document, Model } from 'mongoose';
import { toJSONPlugin } from '../../../models/plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface IExchangeRate extends Document {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  source: string;
  timestamp: Date;
  createdAt: Date;
}

export interface ExchangeRateModel extends Model<IExchangeRate> {
  getRate(from: string, to: string): Promise<number>;
  getLatestRates(baseCurrency: string): Promise<Record<string, number>>;
  updateRate(from: string, to: string, rate: number, source: string): Promise<IExchangeRate>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const exchangeRateSchema = new Schema<IExchangeRate, ExchangeRateModel>({
  fromCurrency: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 3,
    index: true,
  },
  toCurrency: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 3,
    index: true,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  source: {
    type: String,
    required: true,
    trim: true,
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

// ===========================================
// INDEXES
// ===========================================

// Primary query patterns
exchangeRateSchema.index({ fromCurrency: 1, toCurrency: 1, timestamp: -1 });
exchangeRateSchema.index({ fromCurrency: 1, toCurrency: 1 }, { unique: true });

// TTL - keep rates for 1 year
exchangeRateSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 365 * 24 * 60 * 60 }
);

// ===========================================
// STATIC METHODS
// ===========================================

exchangeRateSchema.statics.getRate = async function (from: string, to: string): Promise<number> {
  if (from === to) return 1;
  
  const rate = await this.findOne({
    fromCurrency: from.toUpperCase(),
    toCurrency: to.toUpperCase(),
  }).sort({ timestamp: -1 });
  
  return rate?.rate || 1;
};

exchangeRateSchema.statics.getLatestRates = async function (
  baseCurrency: string
): Promise<Record<string, number>> {
  const rates = await this.aggregate([
    { $match: { fromCurrency: baseCurrency.toUpperCase() } },
    { $sort: { timestamp: -1 } },
    { $group: { _id: '$toCurrency', rate: { $first: '$rate' } } },
  ]);
  
  const result: Record<string, number> = { [baseCurrency]: 1 };
  for (const r of rates) {
    result[r._id] = r.rate;
  }
  return result;
};

exchangeRateSchema.statics.updateRate = async function (
  from: string,
  to: string,
  rate: number,
  source: string
): Promise<IExchangeRate> {
  return this.findOneAndUpdate(
    {
      fromCurrency: from.toUpperCase(),
      toCurrency: to.toUpperCase(),
    },
    {
      rate,
      source,
      timestamp: new Date(),
    },
    { upsert: true, new: true }
  );
};

// ===========================================
// APPLY PLUGINS
// ===========================================

exchangeRateSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const ExchangeRate = Model.model<IExchangeRate, ExchangeRateModel>(
  'ExchangeRate',
  exchangeRateSchema
);

export default ExchangeRate;
