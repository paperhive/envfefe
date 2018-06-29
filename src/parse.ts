import constantCase = require('constant-case');

import * as sanitize from './sanitize';

export type EnvSanitize<R> = ((v: string) => R);

export interface IEnvOptions<R> {
  sanitize: EnvSanitize<R>;
  name?: string;
  optional?: boolean;
  default?: R;
}

export type DefinitionValue<R> = EnvSanitize<R> | IEnvOptions<R>;

export type IEnvDefinition<S> = {
  [k in keyof S]: DefinitionValue<S[k]>
};

export interface IGetEnvOptions<R> extends IEnvOptions<R> {
  name: string;
}

export function parseEnv<R>(options: IGetEnvOptions<R>): R {
  const envValue = process.env[options.name];

  if (!envValue) {
    if (options.default !== undefined) {
      return options.default;
    }

    if (options.optional) {
      return undefined;
    }

    throw new Error(`Missing environment variable ${options.name}.`);
  }

  try {
    return options.sanitize(envValue);
  } catch (error) {
    throw new Error(`Environment variable ${options.name} cannot be sanitized: ${error.message}`);
  }
}

export function parse<S>(definition: IEnvDefinition<S>) {
  const parsed: {[P in keyof S]?: S[P]} = {};

  for (const key in definition) {
    if (definition.hasOwnProperty(key)) {
      const value: DefinitionValue<S[typeof key]> = definition[key];

      const options = typeof value === 'object'
        ? value
        : {sanitize: value};

      parsed[key] = parseEnv({
        ...options,
        name: options.name || constantCase(key),
      });
    }
  }

  return parsed;
}
