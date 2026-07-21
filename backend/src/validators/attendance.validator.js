export const validateSaveAttendance = (req, res, next) => {
  if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
    return res.status(400).json({ success: false, message: 'Attendance records payload is empty' });
  }
  next();
};
