export const validateCreateDriver = (req, res, next) => {
  const { name, employeeId, phone } = req.body;
  if (!name || !employeeId || !phone) {
    return res.status(400).json({ success: false, message: 'Name, employeeId, and phone are required' });
  }
  next();
};
