import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true) as joi.ObjectSchema<EnvVars>;

const validation = envsSchema.validate(process.env);

if (validation.error) {
  throw new Error(`Config validation error: ${validation.error.message}`);
}

const envVars: EnvVars = validation.value;

export const envs = {
  port: envVars.PORT,
  db: envVars.DATABASE_URL,
};
