import { useState } from 'react';

// ==============================================
interface ValidatePair {
  validate_func: (a: string) => boolean;
  error_message: string;
}
const useInput = (validateArr: ValidatePair[], validation_type: string = 'text') => {
  const [enteredValue, setEnteredValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  let has_error = false;
  let error_message = '';

  // -Do extra check on email addresses
  if (validation_type === 'email') {
    validateArr.push({
      // https://www.w3resource.com/javascript/form/email-validation.php
      validate_func: (v: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
      error_message: 'please enter valid email address',
    });
  }

  for (let i = 0; i < validateArr.length; ++i) {
    const value_is_valid = validateArr[i].validate_func(enteredValue);
    const error = !value_is_valid && isTouched;
    if (error) {
      has_error = true;
      error_message = validateArr[i].error_message;
      break; // exit-for-loop
    }
  }

  const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredValue(e.target.value);

    console.log('e.target.value: ', e.target.value, '\thas_error: ', has_error);
  };

  const inputBlurHandler = (/*e: React.FocusEvent<HTMLInputElement>*/) => {
    setIsTouched(true);
  };

  const resetValue = () => {
    setEnteredValue('');
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    has_error,
    setIsTouched,
    valueChangeHandler,
    inputBlurHandler,
    resetValue,
    error_message,
  };
};

// ==============================================

export default useInput;
