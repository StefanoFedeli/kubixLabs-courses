import * as process from 'process';

export const JWT_SECRET_KEY = process.env.JWT_SECRET || 'secret';
export const WEB_PROVIDER = process.env.WEB_PROVIDER || 'secret';