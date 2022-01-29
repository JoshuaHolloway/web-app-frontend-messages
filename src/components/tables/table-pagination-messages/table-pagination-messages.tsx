import { useEffect, MouseEvent, ChangeEvent } from 'react';
import Pagination from '@mui/material/Pagination';
import TablePagination from '@mui/material/TablePagination';
import css from './table-pagination-messages.module.scss';

export default function PaginationComp(props: {
  page: number;
  setPage: any;
  rows_per_page: number;
  setRowsPerPage: any;
  row_count: number;
}) {
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    console.log('row_count: ', props.row_count);
  }, [props.row_count]);

  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, new_page: number) => {
    props.setPage(new_page);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    props.setRowsPerPage(parseInt(event.target.value, 10));
    props.setPage(1);
  };

  return (
    <div className={css.row}>
      <div className={css.container}>
        <Pagination
          count={Math.ceil(props.row_count / props.rows_per_page)}
          page={props.page}
          onChange={(event: any, new_page: number) => props.setPage(new_page)}
        />

        <TablePagination
          component="div"
          count={props.row_count}
          page={props.page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={props.rows_per_page}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-selectLabel': { display: 'none' },
            '& .MuiInputBase-root': { display: 'none' },
            '& .MuiTablePagination-actions': { display: 'none' },
          }} // hide the arrow buttons
        />
      </div>
    </div>
  );
}
