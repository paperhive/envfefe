# envfefe

[![npm version](https://badge.fury.io/js/envfefe.svg)](https://badge.fury.io/js/envfefe)
[![Test](https://github.com/paperhive/envfefe/actions/workflows/test.yaml/badge.svg)](https://github.com/paperhive/envfefe/actions/workflows/test.yaml)
[![codecov](https://codecov.io/gh/paperhive/envfefe/branch/main/graph/badge.svg?token=ASCyvDGYAx)](https://codecov.io/gh/paperhive/envfefe)

> This typescript/javascript package parses environment variables – despite the constant negative press envfefe

![jai030md_19ijj80_q88qdg](https://user-images.githubusercontent.com/1874116/33260253-8be1a670-d35f-11e7-9337-988b4286ed84.png)

Disclaimer: the author of this package opposes Trump and other racists and misogynists.

`envfefe` makes extensive use of the [fefe](https://github.com/paperhive/fefe) module that provides type-safe and purely functional validation, sanitization and transformation.

## Usage

Imagine you use the following environment variables, e.g., in a Docker `.env` file:

```bash
ELASTIC_HOST=elasticsearch
ELASTIC_PORT=9200
ENABLE_CACHE=true
LAUNCH_DATE=2017-12-08T10:00:00.000Z
GCLOUD_CREDENTIALS={"apiKey": "XYZ"}
WHITELIST=ada,john
```

Then you can use `envfefe` for parsing and sanitizing these into an object
that you can use in your application:

```typescript
import { parseEnv } from 'envfefe'
import { parseBoolean, parseDate, parseJson, parseNumber, pipe, string, success } from 'fefe'

const config = parseEnv({
  elasticHost: string(),
  elasticPort: pipe(string()).pipe(parseNumber()),
  enableCache: pipe(string()).pipe(parseBoolean()),
  launchDate: pipe(string()).pipe(parseDate()),
  gcloudCredentials: pipe(string()).pipe(parseJson()),
  whitelist: pipe(string()).pipe(value => success(value.split(','))),
})
```

If validation passes (check via `isSuccess(config)`) then `config.right` will equal:
```typescript
{
  elasticHost: 'elasticsearch',
  elasticPort: 9000,
  enableCache: true,
  launchDate: Date('2017-12-08T10:00:00.000Z'),
  gcloudCredentials: {apiKey: 'XYZ'},
  whitelist: ['ada', 'john']
}
```

This module comes with full TypeScript support so if you are using
TypeScript then `config.right` will have the correct types automatically:
```typescript
{
  elasticHost: string
  elasticPort: number
  enableCache: boolean
  launchDate: Date
  gcloudCredentials: unknown
  whitelist: string[]
}
```

Note:
 * `camelCase` keys are automatically translated to
   `SNAKE_CASE` environment variable names.
 * By default all variables are mandatory. See below for
   optional variables and default values.
 * Values in the resulting object have proper types. If it can't be
   sanitized because of a wrong type (like providing `foo` for a number)
   then `isSuccess(config)` will be `false` and `config.left` contains
   the `FefeError` (see [FefeError docs](https://github.com/paperhive/fefe#fefeerror)).

## Advanced usage

### Optional variables

```javascript
const config = parse({
  elasticHost: optional(string())
});
```

### Default values

```javascript
const config = parse({
  elasticHost: defaultTo(string(), 'default value')
});
```
