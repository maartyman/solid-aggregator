export function resolveUndefinedString(string: String | undefined) : String {
  return string? string : "";
}

export function resolveUndefined<T>(val: T | undefined) : T {
  if (val == undefined) {
    throw new Error('value undefined');
  }
  return val;
}
