import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function FormHelp() {
  // --------------------------------------------

  const [email, setEmail] = useState<string>('');
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);

  const [message, setMessage] = useState<string>('');
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value);

  // --------------------------------------------

  // --------------------------------------------

  return (
    <>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="email" label="email" variant="outlined" value={email} onChange={handleEmailChange} />
      </Box>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="message"
            label="messaage"
            multiline
            rows={4}
            defaultValue="Default Value"
            value={message}
            onChange={handleMessageChange}
          />
        </div>
      </Box>
    </>
  );
}
