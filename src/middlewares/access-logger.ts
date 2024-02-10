
import { Router } from 'express';

export const router = Router();

router.use((req, res, next) => {

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  res.on('finish', () => {
    console.log(` - ${(new Date()).toISOString()} - ${clientIp} | ${res.statusCode} ${req.method} ${req.path}`);
  });

  next();
});

export const accessLoggerMiddleware = router;
