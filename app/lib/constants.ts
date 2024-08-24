export const HOST_NAME = 'http://localhost:5173';
export const APP_NAME = 'SchoolForm';

export const argon2Config = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const TOKEN_LENGTH = 32;
export const TOKEN_TTL = 600_000; // 10 min
