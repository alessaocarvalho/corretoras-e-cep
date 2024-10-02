import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BrokerCatalog from './BrokerCatalog';
import ZipCodeSearcher from './ZipCodeSearcher';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const Home = () => (
  <Container sx={{ textAlign: 'center', mt: 5 }}>
    <Typography variant="h4" gutterBottom>
      Bem-vindo ao Meu Aplicativo!
    </Typography>
    <Typography variant="body1">
      Escolha uma das opções no menu para começar.
    </Typography>
  </Container>
);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Meu Aplicativo
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/brokers">Catálogo de Corretoras</Button>
            <Button color="inherit" component={Link} to="/zipcode">Buscador de CEP</Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 5 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brokers" element={<BrokerCatalog />} />
            <Route path="/zipcode/:cep?" element={<ZipCodeSearcher />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;