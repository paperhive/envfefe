export function boolean(value: string) {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      throw new Error(`Value ${value} is not a boolean.`);
  }
}

export function date(value: string) {
  return new Date(value);
}

export function json(value: string) {
  return JSON.parse(value);
}

export function number(value: string) {
  return parseFloat(value);
}

export function string(value: string) {
  return value;
}
