'use client'
import * as React from 'react';
import {Container, Box, Typography, TextField, Button, Link} from '@mui/material';
import { createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import Image from 'next/image';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#E0E3E7',
            '--TextField-brandBorderHoverColor': '#B2BAC2',
            '--TextField-brandBorderFocusedColor': '#6F7E8C',
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },

      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&::before, &::after': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
    },
  });

export default function Home() {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const outerTheme = useTheme();
  const col6 = ['#3D405B'] // Dark shade
  const col2 = ['#E07A5F'] //red
  const col3 = ['#81B29A'] //green
  const col4 = ['#F4F1DE'] //white
  const col5 = ['#F2CC8F'] //yellow
  const col1 = ['#191c35']; // Darker shade
  return (
<Box
  bgcolor={col1}
  width={'100vw'}
  height={'100vh'}
  display={'flex'}
  justifyContent={'center'}
  alignItems={'center'}
>
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
    >
      <Box
        alignItems={'center'}
        height={'300px'}
        width={'300px'}
      >
        <Image
            src={'/logo.png'}
            width={'300'}
            height={'300'}
            margin={'0 auto'}
          />
      </Box>
        
        <Typography
          color={col4}
          fontSize={'3em'}
          margin={'1em'}
        >
          Learn Buddy
        </Typography>
        <Box
          width={'100%'}
          display={'flex'}
          justifyContent={'center'}
          flexDirection={'column'}
        >
            <Button
              href='../signin/'
              size='large'
              sx={{bgcolor:col2,
                color:col4,
                borderRadius:'2em',
                '&:hover':
                {
                  bgcolor:col4,
                  color:col2
                }
              }}
            >
              Launch
            </Button>
        </Box>
        
    </Box>
    
</Box>
  );
}
