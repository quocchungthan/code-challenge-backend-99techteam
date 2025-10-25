import { Request, Response, NextFunction } from 'express';
import { localEnv } from '../configs/EnvLoader';


export function requireBasicAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
	res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
	return res.status(401).json({ message: 'Missing Authorization Header' });
  }
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === localEnv.BasicUser.Username && password === localEnv.BasicUser.Password) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
  return res.status(401).json({ message: 'Invalid Credentials' });
}
