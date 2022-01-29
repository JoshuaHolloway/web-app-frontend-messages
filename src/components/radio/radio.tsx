import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// ==============================================

export default function RadioButtonsGroup(props: {
  product_id: number;
  product_ids: number[];
  setProductId: (x: number) => void;
}) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Product</FormLabel>
      <RadioGroup row aria-label="product_id" defaultValue="1" name="radio-buttons-group">
        {props?.product_ids.map((product_id) => (
          <FormControlLabel
            key={product_id}
            value={`${product_id}`}
            control={<Radio />}
            label={`${product_id}`}
            onChange={(e: any) => props.setProductId(Number(e.target.value))}
            checked={props.product_id === product_id}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

// ==============================================
