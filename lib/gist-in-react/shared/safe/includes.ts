export const includes = <T extends string[]>(
  array: T,
  key: string,
): key is T[number] => array.includes(key);
