# envfefe

[![npm version](https://badge.fury.io/js/envfefe.svg)](https://badge.fury.io/js/envfefe)
[![Greenkeeper badge](https://badges.greenkeeper.io/paperhive/envfefe.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/paperhive/envfefe.svg?branch=master)](https://travis-ci.org/paperhive/envfefe)
[![codecov](https://codecov.io/gh/paperhive/envfefe/branch/master/graph/badge.svg)](https://codecov.io/gh/paperhive/envfefe)

> This typescript/javascript package parses environment variables – despite the constant negative press envfefe

![jai030md_19ijj80_q88qdg](https://user-images.githubusercontent.com/1874116/33260253-8be1a670-d35f-11e7-9337-988b4286ed84.png)

Disclaimer: the author of this package opposes Trump and other racists and misogynists.

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

```javascript
import { parse, sanitize } from 'envfefe';

const config = parse({
  elasticHost: sanitize.string,
  elasticPost: sanitize.number,
  enableCache: sanitize.boolean,
  launchDate: sanizite.date,
  gcloudCredentials: sanitize.json,
  whitelist: value => sanitize.string(value).split(','),
});
```

The resulting object will then be:
```javascript
{
  elasticHost: 'elasticsearch',
  elasticPost: 9000,
  enableCache: true,
  launchDate: Date('2017-12-08T10:00:00.000Z'),
  gcloudCredentials: {apiKey: 'XYZ'},
  whitelist: ['ada', 'john'],
}
```

Note:
 * `camelCase` keys are automatically translated to
   `SNAKE_CASE` environment variable names. You can override
   this behavior, see below.
 * By default all variables are mandatory. See below for
   optional variables and default values.
 * Values in the resulting object have proper types. If it can't be
   sanitized because of a wrong type (like providing `foo` for a number)
   will throw an error.

## Advanced usage

### Specify environment variable names manually

If you don't use `SNAKE_CASE` for your environment variables
or unrelated names (why would you?) then you can set the name manually:

```javascript
const config = parse({
  elasticHost: {name: 'MYELASTICHOST', sanitize: sanitize.string},
});
```

### Optional variables

```javascript
const config = parse({
  elasticHost: {sanitize: sanitize.string, optional: true},
});
```

### Default values

```javascript
const config = parse({
  elasticHost: {sanitize: sanitize.string, optional: true, default: 'localhost'},
});
```
