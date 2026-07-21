export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, message = 'Internal Server Error', error = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error ? (typeof error === 'string' ? error : error.message || String(error)) : null
  });
};
