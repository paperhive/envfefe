import constantCase = require('constant-case')

export type Sanitizer<R> = (v: string) => R

export interface Option<R> {
  sanitize: Sanitizer<R>
  name?: string
  optional?: boolean
  default?: R
}

export type DefinitionValue<R> = Sanitizer<R> | Option<R>

export type Definition = Record<string, DefinitionValue<any>>

type DefinitionReturnType<T> = T extends DefinitionValue<infer U>
  ? U | (T extends { optional: true } ? undefined : never)
  : never

export interface ParseEnvValueOptions<R> extends Option<R> {
  name: string
}

export function parseEnvValue<R>(
  options: ParseEnvValueOptions<R>
): R | undefined {
  const envValue = process.env[options.name]

  if (!envValue) {
    if (options.default !== undefined) return options.default
    if (options.optional) return undefined
    throw new Error(`Missing environment variable ${options.name}.`)
  }

  try {
    return options.sanitize(envValue)
  } catch (error) {
    throw new Error(
      `Environment variable ${options.name} cannot be sanitized: ${error.message}`
    )
  }
}

export function parseEnv<D extends Definition>(definition: D) {
  const parsed = {} as { [k in keyof D]: DefinitionReturnType<D[k]> }

  Object.keys(definition).forEach((key) => {
    const value = definition[key]

    const options = typeof value === 'object' ? value : { sanitize: value }

    parsed[key] = parseEnvValue({
      ...options,
      name: options.name || constantCase(key),
    })
  })

  return parsed
}
