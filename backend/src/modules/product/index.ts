/**
 * Product Module Index
 * 
 * Exports all product module components.
 */

// Interfaces
export * from './interfaces';

// Models
export { Product } from './models';
export type { IProduct, ProductModel } from './models';

// Repositories
export { productRepository } from './repositories';

// Services
export { productService } from './services';

// Controllers
export { productController } from './controllers';

// Routes
export { default as productRoutes } from './routes';

// Validators
export * from './validators';
