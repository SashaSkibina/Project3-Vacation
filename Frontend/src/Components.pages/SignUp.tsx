import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef, useState } from 'react';
import serverURL from '../utils/ServerURLs';
import { logInUser, userState } from '../redux/userAuth';
import { decodeToken } from 'react-jwt';
import store from '../redux/store';
import { useStyles } from '../theme';
import AlertModal from '../Components/AlertModal/AlertModal';

const style = {color: "red"}

type FormData = {
  f_name: string;
  l_name: string;
  user_name: string;
  user_pass: string;
  repeatPass: string;
}

export default function SignUp(): JSX.Element{
  //errorModal state
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const {register, watch, handleSubmit, formState: { errors }} = useForm<FormData>()
  const navigate = useNavigate();
  const password = useRef({});
  password.current = watch("user_pass", "");
 
  //create user
  const signUp = (user: FormData) => {
    axios.post(serverURL.serverURL + '/login/register', user)
    .then(response => {
        const tokenString = response.headers.authorization
        if (tokenString) {
            const loggedUser: userState = (decodeToken(tokenString) as any).user;
            console.log(loggedUser);
            loggedUser.user_token = tokenString;
            localStorage.setItem("userToken", tokenString);
            loggedUser && store.dispatch(logInUser(loggedUser));
            alert("success!");
            //navigate("/");
        }
        navigate("/");
    })
    .catch(error => {
        //setError(error.response.data) for this i need to create Error state object and useState
        console.log(error);
        showAlert();
    });
  }
  const showAlert = () => {
    setOpen(true);
    setMsg( "Username already exists!" );
  }
  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Container component="main" maxWidth="xs" className={useStyles().defaultStyle}>
      <AlertModal msg={msg} open={open} handleClose={handleClose}/>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonOutlineRoundedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(signUp)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                id="f_name"
                label="First Name"
                autoFocus
                {...register('f_name', {required: "this field is required"})}
              />
              {errors.f_name && <div style={style}>{errors.f_name.message}</div>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                
                fullWidth
                id="l_name"
                label="Last Name"
                autoComplete="family-name"
                {...register('l_name', {required: "this field is required"})}
              />
              {errors.l_name && <div style={style}>{errors.l_name.message}</div>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                
                fullWidth
                id="user_name"
                label="Username"
                autoComplete="user-name"
                {...register('user_name', {required: "this field is required"})}
              />
               {errors.user_name && <div style={style}>{errors.user_name.message}</div>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                
                fullWidth
                label="Password"
                type="user_pass"
                id="user_pass"
                autoComplete="new-password"
                {...register('user_pass', {required: "this field is required"})}
              />
               {errors.user_pass && <div style={style}>{errors.user_pass.message}</div>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Repeat password"
                type="repeatPass"
                id="repeatPass"
                autoComplete="new-password"
                {...register('repeatPass', 
                  {validate: (value: string) => 
                    value === password.current ? undefined : 'Password does not match'
                })}
              />
               {errors.repeatPass && <div style={style}>{errors.repeatPass.message}</div>}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}