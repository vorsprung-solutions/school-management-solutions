import { ZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsynch';
const validateRequest = (schema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Check if the schema expects a nested body structure or direct fields
    const schemaKeys = Object.keys(schema.shape);
    
    if (schemaKeys.includes('body')) {
      // Schema expects nested structure: { body: { ... } }
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });
    } else if (schemaKeys.includes('query')) {
      // Schema expects query structure: { query: { ... } }
      await schema.parseAsync({
        query: req.query,
        cookies: req.cookies,
      });
    } else {
      // Schema expects direct fields: { title: string, description: string }
      await schema.parseAsync(req.body);
    }
    
    next();
  });
};

export default validateRequest;
