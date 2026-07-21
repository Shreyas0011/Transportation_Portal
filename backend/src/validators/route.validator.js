export const validateCreateRoute = (req, res, next) => {
  const { routeName } = req.body;
  if (!routeName) {
    return res.status(400).json({ success: false, message: 'routeName is required' });
  }
  next();
};
