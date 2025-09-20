# MercadoPago Enhanced Implementation Guide

## 1. Configuration Setup

### appsettings.json

Add the enhanced MercadoPago configuration:

```json
{
  "MercadoPago": {
    "PublicKey": "APP_USR-your-public-key",
    "AccessToken": "APP_USR-your-access-token",
    "BaseUrl": "https://api.mercadopago.com/",
    "WebhookSecret": "your-webhook-secret",
    "WebhookUrl": "https://yourdomain.com/api/webhooks/mercadopago",
    "DefaultSuccessUrl": "https://yourdomain.com/payment/success",
    "DefaultFailureUrl": "https://yourdomain.com/payment/failure",
    "DefaultPendingUrl": "https://yourdomain.com/payment/pending",
    "MaxRetryAttempts": 3,
    "TimeoutSeconds": 30,
    "IsSandbox": true,
    "PreferenceCacheMinutes": 60,
    "EnableDetailedLogging": true
  }
}
```

## 2. Dependency Injection Setup

### Program.cs or Startup.cs

Configure services with resilience policies:

```csharp
// Add MercadoPago settings
builder.Services.Configure<MercadoPagoSettings>(
    builder.Configuration.GetSection("MercadoPago"));

// Add HTTP client with Polly
builder.Services.AddHttpClient<IMercadoPagoService, EnhancedMercadoPagoService>(client =>
{
    // Configuration is handled in the service constructor
})
.AddPolicyHandler(GetRetryPolicy())
.AddPolicyHandler(GetCircuitBreakerPolicy());

// Register services
builder.Services.AddScoped<IMercadoPagoService, EnhancedMercadoPagoService>();
builder.Services.AddScoped<IMercadoPagoWebhookService, MercadoPagoWebhookService>();
builder.Services.AddScoped<IPaymentService, PaymentService>(); // Your implementation

// Add health checks
builder.Services.AddHealthChecks()
    .AddCheck<MercadoPagoHealthCheck>("mercadopago");
```

## 3. Security Best Practices

### Webhook Signature Verification

The enhanced service automatically verifies webhook signatures using HMAC-SHA256:

```csharp
// Webhook signature format: ts=timestamp,v1=signature
// Manifest: id:webhook_secret;request-url:webhook_url;ts:timestamp
```

### Environment Variables

Store sensitive configuration in environment variables:

```bash
MERCADOPAGO__ACCESSTOKEN=your-access-token
MERCADOPAGO__WEBHOOKSECRET=your-webhook-secret
```

## 4. Enhanced Features

### Circuit Breaker Pattern

- Opens after 5 consecutive failures
- Stays open for 1 minute
- Automatically tests recovery

### Retry Logic

- Exponential backoff (1s, 2s, 4s)
- Retries only on transient failures
- Configurable retry attempts

### Comprehensive Logging

- Structured logging with correlation IDs
- Performance metrics tracking
- Error details for debugging

### Payment Status Tracking

- Real-time webhook processing
- Payment state synchronization
- Automatic reconciliation

## 5. Usage Examples

### Creating a Payment Preference

```csharp
var request = new CreatePreferenceRequest
{
    TransactionAmount = 100.00m,
    Description = "TKD Class Payment",
    PayerEmail = "student@example.com",
    PayerName = "John",
    PayerSurname = "Doe",
    ExternalReference = "class-123",
    ExpirationDate = DateTime.UtcNow.AddHours(24),
    Metadata = new Dictionary<string, object>
    {
        { "student_id", "456" },
        { "class_id", "789" }
    }
};

var response = await _mercadoPagoService.CreatePreferenceAsync(request);
```

### Processing Webhooks

Webhooks are automatically processed and payment status is updated:

```csharp
// POST /api/webhooks/mercadopago
// Automatic signature verification
// Payment status synchronization
// Error handling and retry logic
```

### Creating Refunds

```csharp
var refundRequest = new CreateRefundRequest
{
    PaymentId = "payment-id",
    Amount = 50.00m, // Partial refund
    Reason = "Student requested refund"
};

var refund = await _mercadoPagoService.CreateRefundAsync(refundRequest);
```

## 6. Monitoring and Observability

### Health Checks

- Endpoint: `/health`
- Checks MercadoPago API connectivity
- Circuit breaker status monitoring

### Metrics to Track

- Payment success/failure rates
- API response times
- Webhook processing delays
- Circuit breaker state changes

### Alerts Setup

- Payment failure spikes
- API timeout increases
- Webhook signature failures
- Circuit breaker openings

## 7. Testing Strategy

### Unit Tests

- Service method validation
- Error handling scenarios
- Webhook signature verification

### Integration Tests

- MercadoPago sandbox testing
- Webhook simulation
- Circuit breaker behavior

### Load Testing

- Payment preference creation
- Webhook processing capacity
- System resilience under load

## 8. Migration from Legacy Implementation

### Backward Compatibility

The enhanced service maintains compatibility with existing code:

```csharp
// Legacy method still works
var response = await mercadoPagoService.CreatePreferenceAsync(
    amount: 100.00m,
    description: "Payment",
    payerEmail: "user@example.com");
```

### Migration Steps

1. Update configuration with new settings
2. Register enhanced services
3. Update webhook endpoints
4. Test in sandbox environment
5. Deploy to production with monitoring

## 9. Production Checklist

- [ ] Configure production MercadoPago credentials
- [ ] Set up webhook URL with HTTPS
- [ ] Configure signature verification
- [ ] Set up monitoring and alerts
- [ ] Test payment flows end-to-end
- [ ] Configure backup payment methods
- [ ] Set up automated health checks
- [ ] Configure log aggregation
- [ ] Test disaster recovery procedures

## 10. Troubleshooting Guide

### Common Issues

- **Webhook signature failures**: Check webhook secret configuration
- **Payment timeouts**: Verify network connectivity and timeout settings
- **Circuit breaker opening**: Check MercadoPago API status and error rates

### Debug Mode

Enable detailed logging in appsettings:

```json
{
  "MercadoPago": {
    "EnableDetailedLogging": true
  }
}
```

This comprehensive implementation provides enterprise-grade payment processing with security, reliability, and observability built-in.
