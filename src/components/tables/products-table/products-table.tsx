import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from 'next/link';
import AuthContext from '@src/code/context/auth-context';
// import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import { toDollarsStr } from '@src/code/functions/money/money';
import { useHttpClient } from '@src/code/hooks/http-hook';
import { Product } from '@src/code/types/Product';
import ProductModal from '@src/components/modal/product-modal';
import RadioButtonsGroup from '@src/components/radio/radio-sort';
import colors from '@style/colors.module.scss';
import css from './products-table.module.scss';

// ==============================================

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// ==============================================

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// ==============================================

export default function ProductsTable() {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  // const loadingCtx = useContext(LoadingContext);
  const notificationCtx = useContext(NotificationContext);

  // --------------------------------------------

  const [openModal, setOpenModal] = useState(false);
  const [modal_type, setModalType] = useState('update');

  const [id, setId] = useState<number | null>(null); // id to send to modal
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  // const [quantity, setQuantity] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // --------------------------------------------

  useEffect(() => {
    (async () => {
      // console.log('Fetching products');

      try {
        // loadingCtx.startLoading();
        // notificationCtx.begin({ message: 'fetching products...' });

        const data = await sendRequest('/api/products', 'GET', null, {
          'Content-Type': 'application/json',
          Authorization: authCtx.token,
        });
        // console.log('data: ', data);

        const sorted_products = data.sort((a: Product, b: Product) => (a.id > b.id ? 1 : -1));
        setProducts(sorted_products);

        // notificationCtx.endSuccess({ message: 'fetched products' });
        // loadingCtx.endLoading();
      } catch (err: any) {
        notificationCtx.endError({ message: err.message });
        // loadingCtx.endLoading();
        console.log('catch, error: ', err.message);
      }
    })();
  }, []);

  // --------------------------------------------

  // -Radio button state:
  const sort_options = ['id', 'title', 'price'];
  const [sort_option, setSortOption] = useState(sort_options[0]);

  // -Sort by criteria when radio button changes value:
  useEffect(() => {
    setProducts((prev_products) =>
      [...prev_products].sort((a: any, b: any) => (a[sort_option] > b[sort_option] ? 1 : -1))
    );
  }, [sort_option]);

  // --------------------------------------------

  return (
    <>
      <ProductModal
        modal_type={modal_type}
        id={id}
        title={title}
        price={price}
        open={openModal}
        setOpen={setOpenModal}
        setProducts={setProducts}
        setSortOption={setSortOption}
      />

      {/* Radio Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem 3rem' }}>
        <RadioButtonsGroup options={sort_options} option={sort_option} setOption={setSortOption} title="Sort By:" />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // setId();
              setTitle('');
              setPrice(0);
              setModalType('add');
              setOpenModal(true);
            }}
          >
            Add Product
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ minWidth: '1000px' }}>
        <Table /* sx={{ minWidth: 700 }}*/ aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ width: 75 }}></StyledTableCell>
              <StyledTableCell style={sort_option === 'id' ? { color: colors.primary, fontWeight: 'bold' } : {}}>
                Product ID
              </StyledTableCell>
              <StyledTableCell style={sort_option === 'title' ? { color: colors.primary, fontWeight: 'bold' } : {}}>
                Product Title
              </StyledTableCell>

              <StyledTableCell>Units in Stock</StyledTableCell>

              <StyledTableCell>Category</StyledTableCell>

              <StyledTableCell
                align="right"
                style={sort_option === 'price' ? { color: colors.primary, fontWeight: 'bold' } : {}}
              >
                Price
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod: Product) => (
              <StyledTableRow key={prod.id}>
                <StyledTableCell align="center">
                  <div className={css.svg_container}>
                    <svg
                      className={css.svg}
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setId(prod.id);
                        setTitle(prod.title);
                        setPrice(prod.price);
                        setModalType('update');
                        setOpenModal(true);
                      }}
                    >
                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                    </svg>
                  </div>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {prod.id}
                </StyledTableCell>
                <StyledTableCell>
                  <Link href={`/admin/products/${prod.id}`}>{prod.title}</Link>
                </StyledTableCell>

                <StyledTableCell>{prod.units_in_stock}</StyledTableCell>

                <StyledTableCell>{prod.category}</StyledTableCell>

                <StyledTableCell align="right">{toDollarsStr(prod.price)}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

// ==============================================
