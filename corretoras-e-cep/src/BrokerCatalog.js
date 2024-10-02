import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';

const BrokerCatalog = () => {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrokers = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://brasilapi.com.br/api/cvm/corretoras/v1');
        if (!response.ok) throw new Error('Erro na rede');
        const data = await response.json();
        setBrokers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  const formatCNPJ = (cnpj) => cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

  if (loading) return <CircularProgress sx={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />;
  if (error) return <Alert severity="error" sx={{ mt: 3, textAlign: 'center' }}>Erro ao buscar corretoras: {error}</Alert>;

  return (
    <Card sx={{ maxWidth: 900, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Catálogo de Corretoras
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome Social</TableCell>
              <TableCell>Município</TableCell>
              <TableCell>CNPJ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brokers.map(broker => (
              <TableRow key={broker.cnpj}>
                <TableCell>{broker.nome_social}</TableCell>
                <TableCell>{broker.municipio}</TableCell>
                <TableCell>{formatCNPJ(broker.cnpj)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BrokerCatalog;