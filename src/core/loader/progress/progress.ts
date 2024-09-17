import { createProgress } from './createProgress.js';
import { pool } from '../../pool/pool.js';

export const progress = createProgress(pool);
