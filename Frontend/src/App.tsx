import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Header';
import Main from './Components.pages/Main';
import LogIn from './Components.pages/LogIn';
import SignUp from './Components.pages/SignUp';
import VacationForm from './Components/VacationForm/VacationForm';
import Statistics from './Components.pages/Statistics';


export default function App() {

  return (
    <Container maxWidth="md" >
      <Box sx={{ my: 4 }}>
        <Header/>
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/addVacation" element={<VacationForm/>}/>
            <Route path="/editVacation/:id" element={<VacationForm/>}/>   
            <Route path="/statistics" element={<Statistics/>}/>
            <Route path="*" element={<Main/>}/>
          </Routes>
        <Footer/>
      </Box>
    </Container>
  );
}
