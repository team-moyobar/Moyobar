import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function LobbyPagination({onChange}: any) {

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value);}

  return (
    <Stack spacing={2}>
      <Pagination count={6} color="secondary" onChange={handleChange} />
    </Stack>
  );
}