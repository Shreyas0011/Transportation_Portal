export const validateCreateUser = (req, res, next) => {
  const { email, password, role, name } = req.body;
  if (!email || !password || !role || !name) {
    return res.status(400).json({ success: false, message: 'Email, password, role, and name are required' });
  }
  next();
};
