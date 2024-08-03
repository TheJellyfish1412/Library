import axios from 'axios';
import Swal from 'sweetalert2'
import React, { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import SaveIcon from '@mui/icons-material/Save';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const options = ['Horror', 'Fantasy', 'Comedy'];

export default function Modal({ showModal, setShowModal }) {
  const [Title, setTitle] = useState("");
  const [Des, setDes] = useState("");
  const [Price, setPrice] = useState(0);
  const [Tags, setTags] = useState("[]");
  const [loading, setLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => {
    if (showModal) {
      setTitle("");
      setDes("");
      setPrice(0);
      setTags([]);
      setSelectedFile(null);
      setImgPreview(null);
    }
  }, [showModal]);

  async function handleClick() {
    setLoading(true);

    const formData = new FormData();
    formData.append('title', Title);
    formData.append('imgName', selectedFile);
    formData.append('description', Des);
    formData.append('price', Price);
    formData.append('tags', Tags);
    try {
      const response = await axios.post('http://localhost:3000/searchBooks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: "Book Added!",
        text: "The book has been added successfully.",
        icon: "success"
      }).then((result) => {
        if (result.isConfirmed) {
          setShowModal(false);
        }
      })
    } catch (error) {
      if(error.toJSON().message === 'Network Error'){
        Swal.fire({
          title: "Failed to add the book.",
          text: "Server down.",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Failed to add the book.",
          text: error.response.data.message,
          icon: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-gray-800">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Add New Book
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <Stack spacing={2} direction="row" className="">
                    <TextField id="title-book" label="Title" variant="outlined" onChange={(e) => setTitle(e.target.value)}/>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Img
                      <VisuallyHiddenInput type="file" onChange={(event)=>{
                        const file = event.target.files[0];
                        setSelectedFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImgPreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }}/>
                    </Button>
                  </Stack>

                  <div className={imgPreview ? 'mt-4 flex justify-space-between' : 'mt-4'}>
                    <Stack spacing={2}>
                      <TextField fullWidth
                        id="description-book"
                        label="Description"
                        multiline
                        maxRows={4}
                        onChange={(e) => setDes(e.target.value)}
                      />
                      
                      <FormControl fullWidth >
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Price
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          label="Price"
                          onChange={(e) => {
                            const val = e.target.value
                            if (val == "" || (val < 0) || !(/^\d*\.?\d*$/.test(val))) {
                              setPrice(0);
                            } else {
                              setPrice(val);
                            }
                          }}
                        />
                      </FormControl>
                      <Autocomplete
                        multiple
                        onChange={(event, newValue) => {
                          setTags(JSON.stringify(newValue));
                          console.log(JSON.stringify(newValue));
                        }}
                        id="checkboxes-tags"
                        options={options}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option}
                        renderOption={(props, option, { selected }) => {
                          const { key, ...optionProps } = props;
                          return (
                            <li key={key} {...optionProps}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option}
                            </li>
                          );
                        }}
                        className="mt-4"
                        renderInput={(params) => (
                          <TextField {...params} label="Tags" placeholder="Name Tag" />
                        )}
                      />
                    </Stack>
                    {imgPreview && <img src={imgPreview} alt="Preview" className='ml-4 object-contain max-w-[200px] max-h-[200px]' />}
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <LoadingButton
                    color="secondary"
                    onClick={handleClick}
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                  >
                    <span>Save</span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}