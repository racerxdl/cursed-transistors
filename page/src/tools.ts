const subMultiple = ["", "m", "µ", "n", "p", "f", "a", "z", "y"];
const multiple = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"]

const toNotationUnit = (v: number): [number, string] => {
  let unit = '';
  let counter = 0;
  let value = v;
  if (value < 1) {
    while (value < 1) {
      counter++;
      value = value * 1e3;
      if (counter === 8) break;
    }
    unit = subMultiple[counter];
  } else {
    while (value >= 1000) {
      counter++;
      value = value / 1e3;
      if (counter === 8) break;
    }
    unit = multiple[counter];
  }
  value = Math.round(value * 1e2) / 1e2;
  return [value, unit];
}

export { toNotationUnit }
