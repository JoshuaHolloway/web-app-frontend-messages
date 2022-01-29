import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// ==============================================

export default function RadioButtonsGroup(props: {
  option: string;
  options: string[];
  setOption: (str: string) => void;
  title: string;
}) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{props.title}</FormLabel>
      <RadioGroup row aria-label="product_id" defaultValue="1" name="radio-buttons-group">
        {props.options.map((option: string) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio />}
            label={option}
            onChange={(e: any) => props.setOption(e.target.value)}
            checked={props.option === option}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

// ==============================================
