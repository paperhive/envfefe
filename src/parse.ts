import constantCase = require('constant-case');

export type EnvSanitize<R> = ((v: string) => R);

export interface IEnvOptions<R> {
  sanitize: EnvSanitize<R>;
  name?: string;
  optional?: boolean;
  default?: R;
}

export type DefinitionValue<R> = EnvSanitize<R> | IEnvOptions<R>;

export type IEnvDefinition = Record<string, DefinitionValue<any>>;

type DefinitionReturnType<T> = T extends DefinitionValue<infer U>
  ? U | (T extends {optional: true} ? undefined : never)
  : never;

export interface IGetEnvOptions<R> extends IEnvOptions<R> {
  name: string;
}

export function parseEnv<R>(options: IGetEnvOptions<R>): R | undefined {
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

export function parse<D extends IEnvDefinition>(definition: D) {
  const parsed = {} as {[k in keyof D]: DefinitionReturnType<D[k]>};

  Object.keys(definition).forEach(key => {
    const value = definition[key];

    const options = typeof value === 'object'
      ? value
      : {sanitize: value};

    parsed[key] = parseEnv({
      ...options,
      name: options.name || constantCase(key),
    });
  });

  return parsed;
}
