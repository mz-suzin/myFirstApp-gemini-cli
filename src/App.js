import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBitcoin, FaEthereum, FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiCardano } from 'react-icons/si';
import { AppBar, Toolbar, Typography, CssBaseline, Container, Card, CardContent, Button, createTheme, ThemeProvider, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import './App.css';

const theme = createTheme({
  palette: {
    background: {
      default: '#fdf5e6' // Smoother vanilla cream
    }
  }
});

function App() {
  
  const [btcPrice, setBtcPrice] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [adaPrice, setAdaPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCoins, setUserCoins] = useState(() => {
    const storedCoins = localStorage.getItem('userCoins');
    return storedCoins ? parseInt(storedCoins, 10) : 1;
  });
  const [hasPaid, setHasPaid] = useState(() => {
    const storedHasPaid = localStorage.getItem('hasPaid');
    return storedHasPaid === 'true';
  });
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd');
        setBtcPrice(response.data.bitcoin.usd);
        setEthPrice(response.data.ethereum.usd);
        setAdaPrice(response.data.cardano.usd);
      } catch (err) {
        console.error("Error fetching cryptocurrency prices:", err);
        setError('Error fetching cryptocurrency prices. See console for details.');
      }
      setLoading(false);
    };

    fetchPrices();
  }, [hasPaid]);

  useEffect(() => {
    localStorage.setItem('userCoins', userCoins.toString());
  }, [userCoins]);

  useEffect(() => {
    localStorage.setItem('hasPaid', hasPaid.toString());
  }, [hasPaid]);

  const handlePay = () => {
    if (userCoins >= 1) {
      setUserCoins(userCoins - 1);
      setHasPaid(true);
    } else {
      alert('You do not have enough coins to view the prices.');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('userCoins');
    localStorage.removeItem('hasPaid');
    window.location.reload();
  };

  const handleResetConfirmationOpen = () => {
    setResetConfirmationOpen(true);
  };

  const handleResetConfirmationClose = () => {
    setResetConfirmationOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <CssBaseline />
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My Portfolio
            </Typography>
            <Typography variant="h6" component="div">
              Coins: {userCoins}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container className="main-content">
          <div className="dashed-border-box">
            <Card sx={{ minWidth: 275, backgroundColor: 'transparent', boxShadow: 'none' }}>
              <CardContent>
                {hasPaid ? (
                  loading ? (
                    <CircularProgress color="inherit" />
                  ) : error ? (
                    <Typography color="error">{error}</Typography>
                  ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                      <Box display="flex" alignItems="center" justifyContent="center" className="btc-price-box" mb={2}>
                        <FaBitcoin size={50} color="#f7931a" />
                        <Box ml={2}>
                          <Typography variant="h5" component="div">
                            Current Bitcoin Price
                          </Typography>
                          <Typography variant="h4">
                            ${btcPrice}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="center" className="eth-price-box" mb={2}>
                        <FaEthereum size={50} color="#627EEA" />
                        <Box ml={2}>
                          <Typography variant="h5" component="div">
                            Current Ethereum Price
                          </Typography>
                          <Typography variant="h4">
                            ${ethPrice}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="center" className="ada-price-box">
                        <SiCardano size={50} color="#0033ad" />
                        <Box ml={2}>
                          <Typography variant="h5" component="div">
                            Current Cardano Price
                          </Typography>
                          <Typography variant="h4">
                            ${adaPrice}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )
                ) : (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Typography variant="h6" component="div" mb={2}>
                      Pay 1 coin to view cryptocurrency prices.
                    </Typography>
                    <Button variant="contained" onClick={handlePay} disabled={userCoins < 1}>
                      Pay to View ({userCoins} coins available)
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </div>
          
        </Container>
        <AppBar position="static" color="transparent" elevation={0} sx={{ mt: 4, bgcolor: '#f0f0f0' }}>
          <Toolbar sx={{ justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <a href="https://www.linkedin.com/in/mz-suzin/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} color="#0077B5" />
              </a>
              <a href="https://github.com/mz-suzin" target="_blank" rel="noopener noreferrer">
                <FaGithub size={30} color="#333" />
              </a>
            </Box>
            <Button variant="outlined" color="inherit" onClick={handleResetConfirmationOpen} sx={{ ml: 2 }}>
              Reset App
            </Button>
          </Toolbar>
        </AppBar>
        <Dialog
          open={resetConfirmationOpen}
          onClose={handleResetConfirmationClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Reset"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to reset the app? This will reset your coins and payment status.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleResetConfirmationClose}>Cancel</Button>
            <Button onClick={handleReset} autoFocus>Reset</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default App;