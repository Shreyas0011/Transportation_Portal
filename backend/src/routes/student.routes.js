import { Router } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import { validateCreateStudent } from '../validators/student.validator.js';

const router = Router();

router.get('/', StudentController.getAllStudents);
router.post('/', validateCreateStudent, StudentController.createStudent);
router.put('/', StudentController.updateStudent);
router.post('/allocate', StudentController.allocateStudent);
router.post('/deallocate', StudentController.deallocateStudent);

export default router;
