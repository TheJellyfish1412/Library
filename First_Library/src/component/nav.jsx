import React from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import Button from '@mui/material/Button';
import Modal from './model';

const options = ['The Godfather', 'Pulp Fiction'];

function nav() {
  const [showModal, setShowModal] = React.useState(false);
  
  return (
    <>
      <nav className='w-full flex justify-around p-5 pl-0 pr-0 items-center'>
        <Autocomplete
          disablePortal
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Book Name" />}
        />
        <Button
          variant="outlined"
          startIcon={<AddCircleIcon />}
          className='h-10 bg-white'
          onClick={() => setShowModal(true)}
        >
          Book
        </Button>
      </nav>
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}

export default nav