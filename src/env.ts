import { config } from 'dotenv';
import { cleanEnv, str, bool } from 'envalid';

config();

export default cleanEnv(process.env, {
  TOKEN: str(),
  ADMIN_ID: str(),
  DEBUG: bool(),
});
