import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import calculateDistance, { getCitiesAlongRoute } from '../../lib/findWaypoints';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

router.post<{}, MessageResponse>('/search', (req, res) => {
  // calculateDistance('Ho Chi Minh City', 'Da Lat', 'AIzaSyB6MfSTw3Glb0gIqVXb8WoMe1TeC3j6G9A');
  getCitiesAlongRoute('Ho Chi Minh City', 'Da Lat', 'AIzaSyB6MfSTw3Glb0gIqVXb8WoMe1TeC3j6G9A');
  res.json({
    message: 'test - 👋🌎🌍🌏',
  });
});

export default router;
