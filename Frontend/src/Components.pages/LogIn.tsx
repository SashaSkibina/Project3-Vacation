import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm} from 'react-hook-form';
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import serverURL from '../utils/ServerURLs';
import { decodeToken } from 'react-jwt';
import { logInUser, userState } from '../redux/userAuth';
import store from '../redux/store';
import { useStyles } from '../theme';
import AlertModal from '../Components/AlertModal/AlertModal';

//construct a type (instead of an object)
type FormData = {
  user_name: string;
  user_pass: string;
};


export default function LogIn(): JSX.Element {
  //errorModal state
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const {register, handleSubmit } = useForm<FormData>()
  //const { register, handleSubmit } = useForm()
  const navigate = useNavigate();
    
  //login user
  const loginUser = (data:any) => {
    axios.post(serverURL.serverURL + '/login/login', data, {
      headers: {
        "allow":"authorization"
      }
    })
    .then(response => {
      //get token from backend
      const tokenString = response.headers.authorization.split(" ")[1];
      if (tokenString) {
        //set values from the decoded token in state (they are under .user)
        const loggedUser: userState = (decodeToken(tokenString) as any).user;
        //add .usertoken to state
        loggedUser.user_token = tokenString;
        //set token in localstorage
        localStorage.setItem("userToken", tokenString);
        loggedUser && store.dispatch(logInUser(loggedUser));
      }
      navigate("/")
    }) 
    .catch(error => {
      console.log(error);
      showAlert();
    });
  }
  const showAlert = () => {
  setOpen(true);
  setMsg( "Username or password are incorrect." );
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
          <LockPersonRoundedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <Box component="form" onSubmit={handleSubmit(loginUser)} sx={{ mt: 1 }}>
          <TextField
            // {...register("user_name")}
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoFocus
            {...register("user_name")}
          />
          <TextField
            // {...register("user_pass")}
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("user_pass")}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}