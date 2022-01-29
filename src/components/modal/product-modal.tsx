import { useState, useEffect, useContext, FormEvent, ChangeEvent } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import AuthContext from '@src/code/context/auth-context';
import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import { useHttpClient } from '@src/code/hooks/http-hook';
// import BasicTextFields from '@src/components/form/form-basic';
// import ValidationTextFields from '@src/components/form/form-validation';
import { Product } from '@src/code/types/Product';

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

export default function ProductModal(props: {
  modal_type: string;
  id: number | null;
  title: string;
  price: number; // comes in as a number (from db), but used in this file as a string due to form-input => hence use String(props.price) in this file.
  // quantity: number | null;
  open: boolean;
  setOpen: (x: boolean) => void;
  setProducts: (products: Product[]) => void;
  setSortOption: (option: string) => void;
}) {
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

  const [title, setTitle] = useState<string>('');
  const [title_error, setTitleError] = useState(false);
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let entered_title = event.target.value;
    if (!entered_title) setTitleError(true);
    else setTitleError(false);
    setTitle(entered_title);
  };
  useEffect(() => setTitle(props.title), [props.title]);

  const [price, setPrice] = useState<string>(''); // NOTE: String due to text input - change to Number before sending to backend!
  const [price_error, setPriceError] = useState(false);
  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    let entered_price = event.target.value?.trim();
    const is_only_numeric = entered_price.match('^[0-9]+$');
    if (!is_only_numeric || Number(entered_price) < 0) {
      setPriceError(true);
      setPrice('');
    } else {
      setPriceError(false);
      setPrice(entered_price);
    }
  };
  useEffect(() => setPrice(String(props.price)), [props.price]);

  // const [quantity, setQuantity] = useState<number | null>(null);
  // const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => setQuantity(Number(event.target.value));

  // --------------------------------------------

  const resetModal = async (products: Product[] | null = null, t = '', p = '') => {
    if (products) {
      const products: Product[] = await sendRequest('/api/products');
      const sorted_products = products.sort((a: Product, b: Product) => (a.id > b.id ? 1 : -1));
      props.setProducts(sorted_products);
      props.setSortOption('id');
    }

    setTitle(t);
    setPrice(p);

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

    if (!title || !price) {
      if (!title) setTitleError(true);
      if (!price) setPriceError(true);
    } else {
      try {
        loadingCtx.startLoading(0.5);

        // - - - - - - - - - - - - - - - - - - -

        if (props.modal_type === 'update') {
          notificationCtx.begin({ message: 'updating product...' });

          // [PUT] /api/products/:id
          await sendRequest(
            `/api/products/${props.id}`,
            'PUT',
            JSON.stringify({
              title,
              price: Number(price), // stored in local state as string due to text-input!
              // quantity
            }),
            {
              'Content-Type': 'application/json',
              Authorization: authCtx.token,
            }
          );

          notificationCtx.endSuccess({ message: 'updated product' });

          // [GET] /api/products
          const products: Product[] = await sendRequest('/api/products');
          resetModal(products);
          // const sorted_products = products.sort((a: Product, b: Product) => (a.id > b.id ? 1 : -1));
          // props.setProducts(sorted_products);
          // props.setSortOption('id');
        }
        // - - - - - - - - - - - - - - - - - - -
        else if (props.modal_type === 'add') {
          notificationCtx.begin({ message: 'adding product...' });
          // [POST] /api/products/:id
          await sendRequest(
            `/api/products`,
            'POST',
            JSON.stringify({
              title,
              price: Number(price), // stored in local state as string due to text-input!
              // quantity
            }),
            {
              'Content-Type': 'application/json',
              Authorization: authCtx.token,
            }
          );

          notificationCtx.endSuccess({ message: 'added product' });

          // [GET] / api / products;
          const products: Product[] = await sendRequest('/api/products');
          resetModal(products);
          // const sorted_products = products.sort((a: Product, b: Product) => (a.id > b.id ? 1 : -1));
          // props.setProducts(sorted_products);
          // props.setSortOption('id');
        } // if-else(props.modal_type)

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

  const handleDelete = async () => {
    try {
      loadingCtx.startLoading(0.5);
      notificationCtx.begin({ message: 'deleting product...' });

      // [PUT] /api/products/:id
      await sendRequest(`/api/products/${props.id}`, 'DELETE', null, {
        'Content-Type': 'application/json',
        Authorization: authCtx.token,
      });

      notificationCtx.endSuccess({ message: 'deleted product' });

      // [GET] /api/products
      const products: Product[] = await sendRequest('/api/products', 'GET', null, {
        'Content-Type': 'application/json',
        Authorization: authCtx.token,
      });

      resetModal(products);
      // const sorted_products = products.sort((a: Product, b: Product) => (a.id > b.id ? 1 : -1));
      // props.setProducts(sorted_products);
      // props.setSortOption('id');
      loadingCtx.endLoading();
    } catch (err: any) {
      notificationCtx.endError({ message: err.message });
      loadingCtx.endLoading();
    }

    props.setOpen(false);
    setTimeout(() => {
      // -wait for the modal to close before changing the button back
      setEnableDelete(false);
    }, 500);
  };

  // --------------------------------------------

  let modal_buttons: JSX.Element | null = null;
  if (props.modal_type === 'update') {
    modal_buttons = (
      <>
        {enable_delete ? (
          <Button variant="contained" color="error" onClick={handleDelete}>
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
            resetModal(null, props.title, String(props.price));
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          type="submit"
          disabled={title_error || price_error || !title || !price}
        >
          Save
        </Button>
      </>
    );
  } else if (props.modal_type === 'add') {
    modal_buttons = (
      <>
        <Button variant="contained" color="primary" onClick={() => props.setOpen(false)}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          type="submit"
          disabled={title_error || price_error || !title || !price}
        >
          Add
        </Button>
      </>
    );
  }

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
                type="number"
                label="price (&#162;)"
                value={price}
                onChange={handlePriceChange}
                required
                error={price_error}
                helperText={price_error ? 'required and numeric only' : ' '}
              />
              {/* <TextField label="quantity" value={quantity} onChange={handleQuantityChange} /> */}
            </div>

            <div>
              <TextField label="category" disabled />
              <TextField label="quantity" disabled />
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
