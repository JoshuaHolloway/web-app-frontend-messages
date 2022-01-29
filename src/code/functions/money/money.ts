const toDollars = (cents: number) => {
  return (cents / 100).toFixed(2);
};

// ==============================================

const toDollarsStr = (cents: number | undefined) => {
  if (cents) return `$${toDollars(cents)}`;
  else return null;
};

// ==============================================

const toDollarsAndCents = (cents: number): string[] => {
  if (cents < 1) {
    return ['0', '00'];
  }

  // Step 0: Convert cents to xx.yy
  const dollars = Number(toDollars(cents));

  // Step 1: Extract the decimal portion:
  const decimal_portion = Number((dollars % 1).toFixed(2));
  // console.log('decimal_portion: ', decimal_portion);

  // Step 3: Extract the whole portion
  const int_portion = Math.round(dollars - decimal_portion);
  // console.log('integer portion: ', int_portion);

  const temp1 = decimal_portion.toString();
  const temp2 = temp1.split('.');
  const temp3 = temp2[1];
  let temp4;
  if (temp3) {
    temp4 = temp3.padStart(2, '0');
  } else {
    temp4 = '00';
  }

  // Step 4: Return string formatted versions
  //         (decimal portion has has leading zero if value is less than 10)
  return [int_portion.toString(), temp4];
};

// ==============================================

export { toDollarsStr, toDollarsAndCents };
