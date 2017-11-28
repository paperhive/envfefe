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
  const time = Date.parse(value);
  if (Number.isNaN(time)) {
    throw new Error(`Value ${value} is not a date.`);
  }
  return new Date(time);
}

export function json(value: string) {
  return JSON.parse(value);
}

export function number(value: string) {
  const num = parseFloat(value);
  if (Number.isNaN(num)) {
    throw new Error(`Value ${value} is not a number.`);
  }
  return num;
}

export function string(value: string) {
  return value;
}
