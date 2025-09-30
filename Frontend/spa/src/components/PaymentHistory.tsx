import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Receipt, Download, Visibility } from "@mui/icons-material";
import { fetchJson } from "../lib/api";
import { toast } from "react-toastify";

interface Payment {
  id: number;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  status: "Pending" | "Completed" | "Failed" | "Refunded";
  description: string;
  studentId?: number;
  studentName?: string;
  coachId?: number;
  coachName?: string;
  eventId?: number;
  eventTitle?: string;
  classId?: number;
  className?: string;
  transactionId?: string;
  receiptUrl?: string;
  notes?: string;
}

interface PaymentFilter {
  status: string;
  paymentMethod: string;
  dateFrom: string;
  dateTo: string;
  userId: string;
}

const initialFilter: PaymentFilter = {
  status: "",
  paymentMethod: "",
  dateFrom: "",
  dateTo: "",
  userId: "",
};

const paymentStatuses = ["Pending", "Completed", "Failed", "Refunded"];
const paymentMethods = [
  "Credit Card",
  "Bank Transfer",
  "Cash",
  "MercadoPago",
  "PayPal",
];

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PaymentFilter>(initialFilter);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payments, filter]);

  const loadPayments = async () => {
    try {
      const data = (await fetchJson("/api/payments")) as Payment[];
      setPayments(data);
    } catch (error) {
      toast.error("Failed to load payment history");
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = payments;

    if (filter.status) {
      filtered = filtered.filter((payment) => payment.status === filter.status);
    }

    if (filter.paymentMethod) {
      filtered = filtered.filter(
        (payment) => payment.paymentMethod === filter.paymentMethod,
      );
    }

    if (filter.dateFrom) {
      filtered = filtered.filter(
        (payment) => new Date(payment.paymentDate) >= new Date(filter.dateFrom),
      );
    }

    if (filter.dateTo) {
      filtered = filtered.filter(
        (payment) => new Date(payment.paymentDate) <= new Date(filter.dateTo),
      );
    }

    if (filter.userId) {
      filtered = filtered.filter(
        (payment) =>
          payment.studentId?.toString().includes(filter.userId) ||
          payment.coachId?.toString().includes(filter.userId) ||
          payment.studentName
            ?.toLowerCase()
            .includes(filter.userId.toLowerCase()) ||
          payment.coachName
            ?.toLowerCase()
            .includes(filter.userId.toLowerCase()),
      );
    }

    setFilteredPayments(filtered);
  };

  const handleFilterChange = (field: keyof PaymentFilter, value: string) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilter(initialFilter);
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailDialogOpen(true);
  };

  const handleDownloadReceipt = async (payment: Payment) => {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, "_blank");
    } else {
      toast.info("Receipt not available for this payment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "error";
      case "Refunded":
        return "info";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  if (loading) {
    return <Typography>Loading payment history...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Payment History
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          Filters
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {paymentStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={filter.paymentMethod}
              onChange={(e) =>
                handleFilterChange("paymentMethod", e.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="From Date"
            type="date"
            size="small"
            value={filter.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="To Date"
            type="date"
            size="small"
            value={filter.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Search User"
            size="small"
            value={filter.userId}
            onChange={(e) => handleFilterChange("userId", e.target.value)}
            placeholder="Name or ID"
          />

          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Payment Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">
                    {formatCurrency(payment.amount, payment.currency)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{payment.description}</Typography>
                  {payment.eventTitle && (
                    <Typography variant="caption" color="text.secondary">
                      Event: {payment.eventTitle}
                    </Typography>
                  )}
                  {payment.className && (
                    <Typography variant="caption" color="text.secondary">
                      Class: {payment.className}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {payment.studentName && (
                    <Typography variant="body2">
                      {payment.studentName} (Student)
                    </Typography>
                  )}
                  {payment.coachName && (
                    <Typography variant="body2">
                      {payment.coachName} (Coach)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={getStatusColor(payment.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewDetails(payment)}
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDownloadReceipt(payment)}
                    size="small"
                    disabled={!payment.receiptUrl}
                  >
                    <Download />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredPayments.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            No payments found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Payment Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Receipt sx={{ mr: 1 }} />
            Payment Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Payment ID:
                </Typography>
                <Typography variant="body2">{selectedPayment.id}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Transaction ID:
                </Typography>
                <Typography variant="body2">
                  {selectedPayment.transactionId || "N/A"}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Amount:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(
                    selectedPayment.amount,
                    selectedPayment.currency,
                  )}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Date:
                </Typography>
                <Typography variant="body2">
                  {new Date(selectedPayment.paymentDate).toLocaleString()}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Method:
                </Typography>
                <Typography variant="body2">
                  {selectedPayment.paymentMethod}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Status:
                </Typography>
                <Chip
                  label={selectedPayment.status}
                  color={getStatusColor(selectedPayment.status) as any}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Description:
                </Typography>
                <Typography variant="body2">
                  {selectedPayment.description}
                </Typography>
              </Box>

              {selectedPayment.notes && (
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Notes:
                  </Typography>
                  <Typography variant="body2">
                    {selectedPayment.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedPayment?.receiptUrl && (
            <Button
              startIcon={<Download />}
              onClick={() =>
                selectedPayment && handleDownloadReceipt(selectedPayment)
              }
            >
              Download Receipt
            </Button>
          )}
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
