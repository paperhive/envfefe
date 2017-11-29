import constantCase = require('constant-case');

import * as sanitize from './sanitize';

export type EnvSanitize = ((v: string) => any);

export interface IEnvOptions {
  sanitize: EnvSanitize;
  name?: string;
  optional?: boolean;
  default?: any;
}

export type DefinitionValue = EnvSanitize | IEnvOptions;

export interface IEnvDefinition {
  [k: string]: DefinitionValue;
}

export interface IGetEnvOptions extends IEnvOptions {
  name: string;
}

export function parseEnv(options: IGetEnvOptions) {
  const envValue = process.env[options.name];

  if (!envValue) {
    if (options.optional) {
      return options.default;
    }
    throw new Error(`Missing environment variable ${options.name}.`);
  }

  try {
    return options.sanitize(envValue);
  } catch (error) {
    throw new Error(`Environment variable ${options.name} cannot be sanitized: ${error.message}`);
  }
}

export function parse<T extends IEnvDefinition>(definition: T) {
  // TODO: replace any with result type of T[k] when typescript supports it
  //       see https://github.com/Microsoft/TypeScript/issues/6606
  const parsed: {[k in keyof T]?: any} = {};

  Object.keys(definition).forEach(key => {
    const value = definition[key];

    const options: IEnvOptions = typeof value === 'object'
      ? value
      : {sanitize: value};

    parsed[key] = parseEnv({
      ...options,
      name: options.name || constantCase(key),
    });
  });

  return parsed;
}
