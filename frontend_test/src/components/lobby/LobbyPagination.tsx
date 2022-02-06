import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box'; 

export default function LobbyPagination({onChange, totalPages}: any) {
  
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value);}
  


  return (
    <Stack spacing={8} >
      <Pagination count={totalPages} color="secondary" onChange={handleChange} variant='outlined' />
    </Stack>
  );
}