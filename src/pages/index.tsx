import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';

import PasswordModal from '@src/components/modal/password-modal';
// import colors from '@style/colors.module.scss';

// ==============================================

const IndexPage: NextPage = () => {
  // --------------------------------------------

  console.log('process.env.NEXT_PUBLIC_API_URL: ', process.env.NEXT_PUBLIC_API_URL);

  return (
    <>
      <PasswordModal />
      <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ mt: 2, mb: 5 }}>
        Get a framed portrait!
      </Typography>
      {/* <img src="http://localhost:9000/img/lena.jpg" /> */}
    </>
  );

  // --------------------------------------------
};

// ==============================================

export default IndexPage;
