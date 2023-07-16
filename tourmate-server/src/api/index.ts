import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

router.post<{}, MessageResponse>('/search', (req, res) => {
  res.json({
    message: 'test - 👋🌎🌍🌏',
  });
});

export default router;
