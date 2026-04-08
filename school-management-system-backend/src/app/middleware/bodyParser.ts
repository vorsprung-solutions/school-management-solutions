import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsynch';

export const parseBody = catchAsync(async (req, res, next) => {
  // Ensure req.body exists
  if (!req.body) {
    console.log('req.body is undefined, skipping parsing');
    return next();
  }

  // If data is sent as a JSON string in the data field
  if (req.body.data) {
    try {
      const parsedData = JSON.parse(req.body.data);
      req.body = parsedData;
      console.log('Successfully parsed data field:', parsedData);
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw new AppError(400, 'Invalid JSON in data field');
    }
  } else {
    console.log('No data field found, body contains:', req.body);
  }
  next();
});
