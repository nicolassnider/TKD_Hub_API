# Step 8: Configure Application Settings - Manual Guide


## Overview
Since the Azure CLI commands may have session issues, here's a manual approach to configure your Static Web App settings through the Azure Portal.


## Your Deployed Resources
- **Resource Group**: tkd-hub-rg
- **SQL Server**: tkd-hub-sql-1170870392.database.windows.net
- **SignalR Service**: tkd-hub-signalr-1170870392
- **Static Web App**: tkd-hub-app-[random-number] (check Azure Portal)


## Step-by-Step Configuration


### 1. Access Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Resource Groups → tkd-hub-rg
3. Find your Static Web App (name starts with "tkd-hub-app-")


### 2. Configure Application Settings
1. Click on your Static Web App
2. Go to **Configuration** → **Application settings**
3. Click **+ Add** for each setting below:


#### Required Settings:


**Database Connection:**
```
Name: DefaultConnection
Value: Server=tcp:tkd-hub-sql-1170870392.database.windows.net,1433;Initial Catalog=TKDHubDb;Persist Security Info=False;User ID=tkdhub-admin;Password=SecurePassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```


**JWT Configuration:**
```
Name: Jwt__SecretKey
Value: YourJWTSecretKey-MustBe256BitsLong-ChangeThisInProduction!


Name: Jwt__Issuer  
Value: https://[your-static-web-app-name].azurestaticapps.net


Name: Jwt__Audience
Value: https://[your-static-web-app-name].azurestaticapps.net
```


**Environment:**
```
Name: ASPNETCORE_ENVIRONMENT
Value: Production
```


**MercadoPago (Replace with your actual values):**
```
Name: MercadoPago__AccessToken
Value: YOUR_MERCADOPAGO_ACCESS_TOKEN


Name: MercadoPago__PublicKey
Value: YOUR_MERCADOPAGO_PUBLIC_KEY


Name: MercadoPago__WebhookSecret
Value: YOUR_MERCADOPAGO_WEBHOOK_SECRET
```


### 3. Get SignalR Connection String
1. Go to Resource Groups → tkd-hub-rg
2. Click on SignalR Service (tkd-hub-signalr-1170870392)
3. Go to **Keys** in the left menu
4. Copy the **Primary Connection String**
5. Add this setting to your Static Web App:


```
Name: SignalRConnectionString
Value: [Paste the connection string from SignalR Keys]
```


### 4. Save Configuration
1. Click **Save** in the Application settings page
2. Wait for the configuration to be applied


## Verification Steps


### 1. Check Static Web App URL
1. In your Static Web App overview page
2. Note the **URL** (should be https://[name].azurestaticapps.net)
3. This will be your frontend URL


### 2. Test Database Connection
You can test the database connection by:
1. Using SQL Server Management Studio
2. Connecting to: tkd-hub-sql-1170870392.database.windows.net
3. Username: tkdhub-admin
4. Password: SecurePassword123!


### 3. Verify SignalR Service
1. Check that the SignalR service is running
2. Mode should be "Serverless" (FREE tier)
3. Status should be "Running"


## Next Steps After Configuration


Once you've completed Step 8, you'll need to:


1. **Step 5**: Set up Azure Functions project locally
2. **Step 9**: Create Azure Functions to replace your API controllers
3. **Step 10**: Deploy the Functions and test the complete application


## Security Notes


⚠️ **IMPORTANT**: The passwords and keys shown here are examples. In production:


1. **Change the SQL admin password** to something more secure
2. **Generate a real JWT secret key** (256 bits minimum)
3. **Use your actual MercadoPago credentials**
4. **Consider using Azure Key Vault** for sensitive values


## Cost Confirmation


With this configuration, your monthly costs should be:
- **Static Web App**: FREE
- **Azure Functions**: FREE (up to 500K requests)
- **SignalR Service**: FREE
- **SQL Database Serverless**: $5-15/month
- **Total**: $5-15/month 🎉


## Troubleshooting


If you encounter issues:
1. Check that all resource names match exactly
2. Verify the SQL server allows Azure services (firewall rule)
3. Ensure SignalR service is in Serverless mode
4. Check Application Insights for any errors


---


**Next**: Once configuration is complete, proceed to Step 5 (Azure Functions setup)