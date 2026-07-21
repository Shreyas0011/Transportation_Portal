export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Email is required and must be a string' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Password is required and must be a string' });
  }
  next();
};
