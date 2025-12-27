import express from 'express'
import { generateQuiz, submitQuiz,getRanking } from '../controllers/quiz_c.js'
import { protect } from '../middleware/authMiddlewares.js'

const router = express.Router();
router.get('/generate/:topicId/:mode',protect,generateQuiz);
router.post('/submit',protect,submitQuiz);
router.get('/ranking/:topicId', getRanking);

export default router
