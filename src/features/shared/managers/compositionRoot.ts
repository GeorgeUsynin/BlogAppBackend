import { EmailAdapter } from '../adapters';
import { EmailManager } from './emailManager';

const emailAdapter = new EmailAdapter();

export const emailManager = new EmailManager(emailAdapter);
