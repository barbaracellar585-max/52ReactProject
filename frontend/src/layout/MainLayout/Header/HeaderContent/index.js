// material-ui
import { useMediaQuery } from '@mui/material';

// project import
// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {matchesXs}
    </>
  );
};

export default HeaderContent;
