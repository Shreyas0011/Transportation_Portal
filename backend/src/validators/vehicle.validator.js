export const validateCreateVehicle = (req, res, next) => {
  const { vehicleNumber } = req.body;
  if (!vehicleNumber) {
    return res.status(400).json({ success: false, message: 'vehicleNumber is required' });
  }
  next();
};
