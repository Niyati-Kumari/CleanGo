import { Router } from 'express';
import { getCatalog, listCleaners, getCleaner } from '../controllers/cleaners.controller.js';

const router = Router();

router.get('/catalog', getCatalog);
router.get('/', listCleaners);
router.get('/:id', getCleaner);

export default router;
