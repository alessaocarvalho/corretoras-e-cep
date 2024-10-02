import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { TextField, Button, CircularProgress, Alert, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const ZipCodeSearcher = () => {
  const { cep } = useParams();
  const [zipCode, setZipCode] = useState(cep || '');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cep) handleSearch(cep);
  }, [cep]);

  const handleSearch = (inputCep) => {
    const sanitizedZipCode = inputCep.replace(/\D/g, '');
    if (sanitizedZipCode.length !== 8) {
      setError('Por favor, insira um CEP válido.');
      return;
    }

    setError(null);
    setLoading(true);

    fetch(`https://brasilapi.com.br/api/cep/v2/${sanitizedZipCode}`)
      .then(response => {
        if (!response.ok) throw new Error('CEP não encontrado.');
        return response.json();
      })
      .then(data => {
        const formattedCep = `${sanitizedZipCode.slice(0, 5)}-${sanitizedZipCode.slice(5)}`; // Formatação do CEP
        setAddresses(prev => [...prev, { ...data, cep: formattedCep }]);
        setZipCode('');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const clearAddresses = () => {
    setAddresses([]);
    setZipCode('');
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Buscador de CEP
        </Typography>

        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <InputMask
            mask="99999-999"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          >
            {() => (
              <TextField
                fullWidth
                label="Digite o CEP (ex: 12345-678)"
                variant="outlined"
                error={Boolean(error)}
                helperText={error}
                autoComplete="off"
                inputProps={{ maxLength: 10 }}
              />
            )}
          </InputMask>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSearch(zipCode)}
            sx={{ ml: 2 }}
          >
            Buscar
          </Button>
        </div>

        {loading && <CircularProgress sx={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {addresses.length > 0 && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Endereços Encontrados:
              </Typography>
              <List>
                {addresses.map((address, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={address.street}
                      secondary={`${address.neighborhood}, ${address.city} - ${address.state} (CEP: ${address.cep})`}
                    />
                  </ListItem>
                ))}
              </List>
              <Button variant="outlined" color="secondary" onClick={clearAddresses} sx={{ mt: 2 }}>
                Limpar Todos
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default ZipCodeSearcher;