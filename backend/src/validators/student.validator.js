export const validateCreateStudent = (req, res, next) => {
  const { studentName, studentId, parentContact } = req.body;
  if (!studentName || !studentId || !parentContact) {
    return res.status(400).json({ success: false, message: 'studentName, studentId, and parentContact are required' });
  }
  next();
};
