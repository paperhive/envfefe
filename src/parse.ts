import constantCase = require('constant-case');

type ExtractReturnType<T> = T extends EnvSanitize<any>
  ? ReturnType<T>
  : T extends {sanitize: infer U}
    ? ReturnType<U extends EnvSanitize<any> ? U : any> | (T extends {optional: boolean} ? undefined : never)
    : never;

export type EnvSanitize<R> = ((v: string) => R);

export interface IEnvOptions<R> {
  sanitize: EnvSanitize<R>;
  name?: string;
  optional?: true;
  default?: R;
}

export type DefinitionValue<R> = EnvSanitize<R> | IEnvOptions<R>;

export type IEnvDefinition<S> = {
  [k in keyof S]: DefinitionValue<S[k]>
};

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

export function parse<A>(definition: A & Record<string, DefinitionValue<any>>): {
  [X in keyof A]: ExtractReturnType<A[X]>
} {
  const parsed: Partial<Record<keyof typeof definition, any>> = {};

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

  return parsed as any;
}
