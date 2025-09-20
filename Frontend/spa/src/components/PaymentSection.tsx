import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useProfile } from '../context/ProfileContext';
import { PaymentFormData, PAYMENT_METHODS } from '../types/profile';

export const PaymentSection: React.FC = () => {
  const {
    paymentHistory,
    nextPayment,
    enrolledClass,
    createPayment,
    loading,
    error,
  } = useProfile();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    amount: 0,
    description: '',
    classId: enrolledClass?.id,
    dueDate: '',
    currency: 'ARS',
  });

  const handlePaymentSubmit = async () => {
    if (!paymentForm.amount || !paymentForm.description) return;
    
    const payment = await createPayment(paymentForm);
    if (payment) {
      setPaymentDialogOpen(false);
      // Redirect to MercadoPago
      if (payment.paymentUrl) {
        window.open(payment.paymentUrl, '_blank');
      }
    }
  };

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
      case 'approved':
        return 'success';
      case 'Pending':
      case 'pending':
        return 'warning';
      case 'Overdue':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'approved':
        return <CheckCircleIcon color="success" />;
      case 'Pending':
      case 'pending':
        return <ScheduleIcon color="warning" />;
      case 'Overdue':
      case 'rejected':
        return <WarningIcon color="error" />;
      default:
        return <PaymentIcon />;
    }
  };

  const upcomingPayments = paymentHistory.filter(p => p.status === 'Pending' && new Date(p.dueDate) > new Date());
  const recentPayments = paymentHistory.filter(p => p.status === 'Paid').slice(0, 5);
  const overduePayments = paymentHistory.filter(p => p.status === 'Overdue');

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Payment Status Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: overduePayments.length > 0 ? 'error.50' : 'success.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PaymentIcon sx={{ 
                fontSize: 40, 
                color: overduePayments.length > 0 ? 'error.main' : 'success.main',
                mb: 1 
              }} />
              <Typography variant="h6" color={overduePayments.length > 0 ? 'error.main' : 'success.main'}>
                {overduePayments.length > 0 ? 'Payment Overdue' : 'Up to Date'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current payment status
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" color="warning.main">
                {upcomingPayments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <HistoryIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6" color="info.main">
                {recentPayments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent Payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Next Payment Due */}
      {nextPayment && (
        <Card sx={{ mb: 4, bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" color="warning.dark" gutterBottom>
                  Payment Due
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {nextPayment.description}
                </Typography>
                <Typography variant="h5" color="warning.dark">
                  {formatCurrency(nextPayment.amount, nextPayment.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due: {formatDate(nextPayment.dueDate)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="warning"
                startIcon={<CreditCardIcon />}
                onClick={() => {
                  setPaymentForm({
                    ...paymentForm,
                    amount: nextPayment.amount,
                    description: nextPayment.description,
                    dueDate: nextPayment.dueDate,
                  });
                  setPaymentDialogOpen(true);
                }}
              >
                Pay Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Overdue Payments */}
      {overduePayments.length > 0 && (
        <Card sx={{ mb: 4, bgcolor: 'error.50', borderLeft: 4, borderColor: 'error.main' }}>
          <CardContent>
            <Typography variant="h6" color="error.dark" gutterBottom>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon />
                Overdue Payments ({overduePayments.length})
              </Box>
            </Typography>
            
            <List>
              {overduePayments.map((payment) => (
                <ListItem key={payment.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    {getPaymentStatusIcon(payment.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={payment.description}
                    secondary={`Due: ${formatDate(payment.dueDate)} • ${formatCurrency(payment.amount, payment.currency)}`}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setPaymentForm({
                        ...paymentForm,
                        amount: payment.amount,
                        description: payment.description,
                        dueDate: payment.dueDate,
                      });
                      setPaymentDialogOpen(true);
                    }}
                  >
                    Pay Now
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Payments */}
      {upcomingPayments.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon />
                Upcoming Payments
              </Box>
            </Typography>
            
            <List>
              {upcomingPayments.map((payment) => (
                <ListItem key={payment.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    {getPaymentStatusIcon(payment.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={payment.description}
                    secondary={`Due: ${formatDate(payment.dueDate)} • ${formatCurrency(payment.amount, payment.currency)}`}
                  />
                  <Chip
                    label={payment.status}
                    color={getPaymentStatusColor(payment.status) as any}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon />
                Payment History
              </Box>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setPaymentDialogOpen(true)}
              >
                New Payment
              </Button>
              <IconButton onClick={() => setHistoryExpanded(!historyExpanded)}>
                {historyExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>

          {recentPayments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              No payment history available
            </Typography>
          ) : (
            <>
              <List>
                {(historyExpanded ? paymentHistory : recentPayments).map((payment, index) => (
                  <React.Fragment key={payment.id}>
                    {index > 0 && <Divider />}
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getPaymentStatusIcon(payment.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={payment.description}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {formatDate(payment.paymentDate)} • {payment.paymentMethod}
                            </Typography>
                            {payment.transactionId && (
                              <Typography variant="caption" color="text.secondary">
                                Transaction ID: {payment.transactionId}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" gutterBottom>
                          {formatCurrency(payment.amount, payment.currency)}
                        </Typography>
                        <Chip
                          label={payment.status}
                          color={getPaymentStatusColor(payment.status) as any}
                          size="small"
                        />
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>

              <Collapse in={historyExpanded}>
                {paymentHistory.length > 5 && !historyExpanded && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button onClick={() => setHistoryExpanded(true)}>
                      Show All ({paymentHistory.length}) Payments
                    </Button>
                  </Box>
                )}
              </Collapse>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCardIcon />
            Make Payment
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                placeholder="Monthly class fee, registration, etc."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Currency"
                value={paymentForm.currency}
                onChange={(e) => setPaymentForm({ ...paymentForm, currency: e.target.value })}
              >
                <MenuItem value="ARS">ARS (Peso Argentino)</MenuItem>
                <MenuItem value="USD">USD (US Dollar)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={paymentForm.dueDate}
                onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              You will be redirected to MercadoPago to complete your payment securely.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePaymentSubmit}
            disabled={!paymentForm.amount || !paymentForm.description || loading}
            startIcon={<CreditCardIcon />}
          >
            Continue to MercadoPago
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
