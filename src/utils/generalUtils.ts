export function resolveUndefinedString(string: String | undefined) : String {
  return string? string : "";
}

export function resolveUndefined<T>(val: T | undefined, defaultValue?: T) : T {
  if (val == undefined) {
    if (defaultValue == undefined) {
      throw new Error('value undefined');
    }
    else {
      return defaultValue;
    }
  }
  return val;
}

export function arrayEquality(array1: [any], array2: [any]): boolean {
  for (const element1 of array1) {
    let equal = false;
    for (const element2 of array2) {
      if (element1 === element2) {
        equal = true;
        break;
      }
    }
    if (!equal) {
      return false;
    }
  }
  for (const element2 of array2) {
    let equal = false;
    for (const element1 of array1) {
      if (element1 === element2) {
        equal = true;
        break;
      }
    }
    if (!equal) {
      return false;
    }
  }
  return true;
}


