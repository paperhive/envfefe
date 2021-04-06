import { constantCase } from 'constant-case'
import {
  ObjectDefinition,
  object,
  ObjectResult,
  pipe,
  mapObjectKeys,
  Validator,
  Result,
} from 'fefe'

export interface EnvParserOptions {
  allErrors?: boolean
}

export const envParser = <D extends ObjectDefinition>(
  definition: D,
  options: EnvParserOptions = {}
): Validator<ObjectResult<D>> => {
  const mappedDefinition = Object.fromEntries(
    Object.entries(definition).map(([k, v]) => [constantCase(k), v])
  )
  const map = Object.fromEntries(
    Object.keys(definition).map((k) => [k, constantCase(k)])
  ) as { [k: string]: string }
  return pipe(
    object(mappedDefinition, { allowExcessProperties: true, ...options })
  ).pipe(mapObjectKeys(map)) as Validator<ObjectResult<D>>
}

export function parseEnv<D extends ObjectDefinition>(
  definition: D,
  options: EnvParserOptions = {}
): Result<ObjectResult<D>> {
  return envParser(definition, options)(process.env)
}
