import { useState, useEffect, useContext, FormEvent, ChangeEvent } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import AuthContext from '@src/code/context/auth-context';
import NotificationContext from '@src/code/context/notification-context';
import LoadingContext from '@src/code/context/loading-context';
import { useHttpClient } from '@src/code/hooks/http-hook';
// import BasicTextFields from '@src/components/form/form-basic';
// import ValidationTextFields from '@src/components/form/form-validation';
import { Product } from '@src/code/types/Product';
import CustomizedMenus from '@src/components/dropdown/customized-menu';
// import Grid from '@mui/material/Grid';

// ==============================================

function ChildModal(props: {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  setEnableDelete: (x: boolean) => void;
}) {
  return (
    <>
      <Modal
        hideBackdrop
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Fade in={props.open}>
          <Box
            sx={{
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: 400,
              height: 200,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              pt: 2,
              px: 4,
              pb: 3,
            }}
          >
            {/* <h2 id="child-modal-title">Text in a child modal</h2> */}
            {/* <p id="child-modal-description">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p> */}

            <Button variant="contained" color="primary" onClick={props.handleClose}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                props.setEnableDelete(true);
                props.handleClose();
              }}
            >
              Enable Delete
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
// ==============================================

export default function ProductModal(props: { open: boolean; setOpen: (x: boolean) => void }) {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();
  const notificationCtx = useContext(NotificationContext);
  const loadingCtx = useContext(LoadingContext);
  const authCtx = useContext(AuthContext);

  // --------------------------------------------

  // const [open, setOpen] = useState(false);
  // const handleOpen = () => props.setOpen(true);
  // const handleClose = () => setOpen(false);

  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason !== 'backdropClick') {
      props.setOpen(false);
    }
  };

  // --------------------------------------------

  const [enable_delete, setEnableDelete] = useState(false);

  const [openChild, setOpenChild] = useState(false);
  const handleOpenChild = () => {
    setOpenChild(true);
  };
  const handleCloseChild = () => {
    setOpenChild(false);
  };

  // --------------------------------------------

  const [username, setUsername] = useState<string>('');
  const [username_error, setUsernameError] = useState(false);
  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    let entered_username = event.target.value;
    if (!entered_username) setUsernameError(true);
    else setUsernameError(false);
    setUsername(entered_username);
  };

  const [title, setTitle] = useState<string>('');
  const [title_error, setTitleError] = useState(false);
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let entered_title = event.target.value;
    if (!entered_title) setTitleError(true);
    else setTitleError(false);
    setTitle(entered_title);
  };
  // useEffect(() => setTitle(props.title), [props.title]);

  const [message, setMessage] = useState<string>(''); // NOTE: String due to text input - change to Number before sending to backend!
  const [message_error, setMessageError] = useState(false);
  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    let entered_message = event.target.value;
    if (!entered_message) setTitleError(true);
    else setMessageError(false);
    setMessage(entered_message);
  };
  // useEffect(() => setPrice(String(props.price)), [props.price]);

  // const [quantity, setQuantity] = useState<number | null>(null);
  // const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => setQuantity(Number(event.target.value));

  // --------------------------------------------

  const resetModal = async (products: Product[] | null = null, t = '', m = '') => {
    if (products) {
      const products: Product[] = await sendRequest('/api/products');
      const sorted_products = products.sort((a: Product, b: Product) => (a.id > b.id ? 1 : -1));
      // props.setProducts(sorted_products);
      // props.setSortOption('id');
    }

    setTitle(t);
    setMessage(m);

    setTimeout(() => {
      // -wait for the modal to close before changing the button back
      setEnableDelete(false);
    }, 500);
  };

  useEffect(() => {
    console.log('title: ', title);
  }, [title]);

  // --------------------------------------------

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || !message) {
      if (!title) setTitleError(true);
      if (!message) setMessageError(true);
    } else {
      try {
        loadingCtx.startLoading(0.5);

        // - - - - - - - - - - - - - - - - - - -

        notificationCtx.begin({ message: 'sending message...' });
        // [POST] /api/products/:id
        await sendRequest(
          `/api/messages`,
          'POST',
          JSON.stringify({
            message,
            status: 1,
            starred: false,
            // date_time: '',
            // date_time_index: 0,
            // date_index: 0,
            user_id: 1,
          }),
          {
            'Content-Type': 'application/json',
            Authorization: authCtx.token,
          }
        );

        notificationCtx.endSuccess({ message: 'message sent!' });

        // - - - - - - - - - - - - - - - - - - -

        loadingCtx.endLoading();
      } catch (err: any) {
        notificationCtx.endError({ message: err.message });
        loadingCtx.endLoading();
      }

      props.setOpen(false);
    }
  };

  // --------------------------------------------

  let modal_buttons: JSX.Element | null = null;
  modal_buttons = (
    <>
      {enable_delete ? (
        <Button variant="contained" color="error" onClick={() => alert('handle this!')}>
          Delete
        </Button>
      ) : (
        <Button variant="contained" color="warning" onClick={() => setOpenChild(true)}>
          Options
        </Button>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          props.setOpen(false);
          // resetModal(null, props.title, String(props.price));
        }}
      >
        Cancel
      </Button>
      <Button variant="contained" color="success" type="submit" disabled={true}>
        Save Draft
      </Button>

      <Button
        variant="contained"
        color="success"
        type="submit"
        disabled={title_error || message_error || !title || !message}
      >
        Send
      </Button>
    </>
  );

  // --------------------------------------------

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              // width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Box sx={{ display: 'flex' }}>
              <CustomizedMenus />
            </Box>

            <div>
              <TextField
                type="text"
                label="title"
                value={title}
                onChange={handleTitleChange}
                required
                error={title_error}
                helperText={title_error ? 'required' : ' '}
              />
              <TextField
                type="text"
                label="message"
                value={message}
                onChange={handleMessageChange}
                required
                error={message_error}
                helperText={message_error ? 'required' : ' '}
              />
              {/* <TextField label="quantity" value={quantity} onChange={handleQuantityChange} /> */}
            </div>

            <div>
              <TextField
                type="text"
                label="username"
                value={username}
                onChange={handleUsernameChange}
                required
                error={username_error}
                helperText={username_error ? 'required' : ' '}
              />
              {/* <TextField label="quantity" disabled /> */}
              {/* <TextField label="quantity" value={quantity} onChange={handleQuantityChange} /> */}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2rem', marginBottom: '.75rem' }}>
              {modal_buttons}
            </div>

            <ChildModal
              open={openChild}
              handleOpen={handleOpenChild}
              handleClose={handleCloseChild}
              setEnableDelete={setEnableDelete}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );

  // --------------------------------------------
}

// ==============================================
