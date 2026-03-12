import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import bgImage from '../assets/signup.jpg';
import Snackbar from "@mui/material/Snackbar";

import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import type { JSX } from 'react/jsx-runtime';



const defaultTheme = createTheme();

export default function Authentication(): JSX.Element {

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');

  const [formState, setFormState] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);

  const { handleRegister, handleLogin } = useAuth();

    const handleAuth = async (): Promise<void> => {
      try {
        if(formState === 0){
          const result = await handleLogin(username, password);
          setMessage("Login successful");
          setOpen(true);
          setError('');
        }
        if (formState === 1) {
          const result = await handleRegister(name, username, password);
          setMessage(result || "Registration successful");
          setOpen(true);
          setError('');
          setFormState(0);
          setPassword('');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const message =
            err.response?.data?.message ?? "Something went wrong";
          setMessage(message);
        } else {
          setMessage("Unexpected error occurred");
        }
      }
    };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh',width: '100vw' }}>
        <CssBaseline />
        <Grid
        item
        xs={0}
        sm={6}
        md={6}
        sx={{
            display: { xs: 'none', sm: 'block' },
            backgroundImage: `url(${bgImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
        />
        <Grid item xs={12} sm={6} md={6} component={Paper} elevation={6} square 
        sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#fceffa'}}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'rgb(51,31,50)' }}>
              <LockOutlinedIcon />
            </Avatar>

            <div>
                <Button variant={formState === 0 ? "contained" : "text"} onClick={() => setFormState(0)} sx={{ mt: 3, mb: 2 }}>
                    Sign In
                </Button>
                <Button variant={formState === 1 ? "contained" : "text"} onClick={() => setFormState(1)} sx={{ mt: 3, mb: 2 }}>
                    Sign Up
                </Button>
            </div>

            <Box component="form" noValidate sx={{ mt: 1 }}>
                {formState === 1 ? 
                <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Full Name"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(e)=>setName(e.target.value)}
              /> : null}
              <TextField
                margin="normal"
                required 
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(e)=>setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e)=>setPassword(e.target.value)}
              />
              <p style={{color: 'red'}}>{error}</p>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={message}
      />
    </ThemeProvider>
  );
}

