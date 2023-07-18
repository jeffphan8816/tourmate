import 'dotenv/config';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Base64 as base64 } from 'js-base64';

function assertEnvVar(name: string): string {
  if (!process.env[name]) {
    throw new Error(`Missing ${name} env var`);
  }

  return process.env[name]!;
}

const googleMapsKey = assertEnvVar('GOOGLE_MAPS_KEY');
// const redisUrl = assertEnvVar('REDIS_URL');

export const config = {
  googleMapsKey,
};