import { Request, Response } from 'express';

interface HealthResponse {
  status: string;
  timestamp: string;
}

export function getHealth(_req: Request, res: Response): Response {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  return res.status(200).json(response);
}
