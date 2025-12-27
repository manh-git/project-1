import express from 'express';
import { getVocabs,updateVocabStatusController } from '../controllers/flashcard_c.js';
import { protect } from '../middleware/authMiddlewares.js'
const router = express.Router();

router.get('/topics/:topicId',protect, getVocabs);
router.post('/vocab/status/:vocabId',protect, updateVocabStatusController);
export default router;