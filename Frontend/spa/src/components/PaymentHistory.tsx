import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  TextField,
  MenuItem,
  Grid,
  Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Receipt as ReceiptIcon,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useProfile } from '../context/ProfileContext';
import { PaymentInfo } from '../types/profile';

interface PaymentHistoryProps {
  compact?: boolean;
  maxItems?: number;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ 
  compact = false, 
  maxItems = 10 
}) => {
  const { paymentHistory } = useProfile();
  
  const [expanded, setExpanded] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number, currency: string = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'error';
      case 'Cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  // Filter payments based on status and search term
  const filteredPayments = paymentHistory.filter(payment => {
    const matchesStatus = filterStatus === 'All' || payment.status === filterStatus;
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Limit payments for display
  const displayPayments = expanded ? filteredPayments : filteredPayments.slice(0, maxItems);

  const handleDownloadReceipt = (payment: PaymentInfo) => {
    // This would typically generate and download a PDF receipt
    console.log('Download receipt for payment:', payment.id);
    // Implementation would depend on your backend API
  };

  if (compact) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Recent Payments
        </Typography>
        
        {paymentHistory.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No payment history available
          </Typography>
        ) : (
          <Box>
            {paymentHistory.slice(0, 3).map((payment) => (
              <Box key={payment.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Box>
                  <Typography variant="body2">{payment.description}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(payment.paymentDate)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">
                    {formatCurrency(payment.amount, payment.currency)}
                  </Typography>
                  <Chip
                    label={payment.status}
                    color={getPaymentStatusColor(payment.status) as any}
                    size="small"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Payment History
          </Typography>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Filters */}
        <Collapse in={expanded}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Search payments"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                size="small"
                label="Filter by status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="All">All Payments</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Collapse>

        {/* Payments Table */}
        {displayPayments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            {searchTerm || filterStatus !== 'All' ? 'No payments match your filters' : 'No payment history available'}
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {payment.description}
                        </Typography>
                        {payment.className && (
                          <Typography variant="caption" color="text.secondary">
                            {payment.className}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(payment.paymentDate)}
                      </Typography>
                      {payment.dueDate !== payment.paymentDate && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Due: {formatDate(payment.dueDate)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(payment.amount, payment.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payment.paymentMethod}
                      </Typography>
                      {payment.transactionId && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          ID: {payment.transactionId}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={getPaymentStatusColor(payment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {payment.status === 'Paid' && (
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadReceipt(payment)}
                          title="Download Receipt"
                        >
                          <FileDownloadIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Show More Button */}
        {!expanded && filteredPayments.length > maxItems && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button onClick={() => setExpanded(true)}>
              Show All ({filteredPayments.length}) Payments
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
