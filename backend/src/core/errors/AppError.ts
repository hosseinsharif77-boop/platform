/**
 * Base Application Error
 * 
 * All custom errors extend this base class.
 * Provides consistent error structure across the application.
 */

export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date();

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp.toISOString(),
      },
    };
  }
}

export default AppError;
