export const validateLogin = (req, res, next) => {
  const identifier = req.body.email || req.body.identifier;
  if (!identifier || typeof identifier !== 'string') {
    return res.status(400).json({ success: false, message: 'Email or Enrollment ID is required' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Password is required and must be a string' });
  }
  next();
};
