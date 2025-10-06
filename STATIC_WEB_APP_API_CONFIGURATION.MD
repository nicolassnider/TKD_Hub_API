# API Configuration for Static Web App

This guide explains how the Static Web App is configured to communicate with the deployed Web API.

## Automatic Configuration

The GitHub Actions workflow automatically configures the Static Web App to use the deployed Web API backend by:

1. **Runtime Configuration**: Creates a `config.js` file with the API base URL
2. **Static Web App Settings**: Configures the Static Web App with API backend settings
3. **Index.html Injection**: Adds the runtime configuration script to the main HTML file

## Configuration Files Created

### config.js
```javascript
window.ENV = {
  VITE_PUBLIC_API_URL: 'https://your-api-app.azurewebsites.net'
};
```

### config.json
```json
{
  "VITE_PUBLIC_API_URL": "https://your-api-app.azurewebsites.net"
}
```

## Static Web App Routes

The `staticwebapp.config.json` is configured to:
- Allow anonymous access to `/api/*` routes
- Support all HTTP methods (GET, POST, PUT, DELETE, etc.)
- Redirect admin routes to require admin role
- Route all other requests to the SPA

## Manual Configuration (if needed)

If automatic configuration fails, you can manually configure the API connection:

### 1. Update App Settings in Azure Portal

1. Go to your Static Web App in Azure Portal
2. Navigate to **Configuration** → **Application settings**
3. Add a new setting:
   - **Name**: `API_BASE_URL`
   - **Value**: `https://your-api-app.azurewebsites.net`

### 2. Link Backend API (Alternative Method)

```bash
# Get your Static Web App and Web App details
SWA_NAME="your-app-swa"
WEB_APP_NAME="your-app-api"
RESOURCE_GROUP="your-resource-group"
SUBSCRIPTION_ID="your-subscription-id"

# Link the backend
az staticwebapp backends link \
  --name "$SWA_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --backend-resource-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$WEB_APP_NAME" \
  --backend-region "eastus"
```

### 3. Update Frontend Code (if needed)

If the automatic configuration doesn't work, update your frontend code to load the configuration:

```typescript
// Load runtime configuration
const loadConfig = async () => {
  try {
    const response = await fetch('/config.json');
    const config = await response.json();
    return config;
  } catch (error) {
    console.warn('Could not load runtime config, using defaults');
    return { VITE_PUBLIC_API_URL: 'https://localhost:7046' };
  }
};

// Use in your API service
const config = await loadConfig();
const apiBaseUrl = config.VITE_PUBLIC_API_URL;
```

## Troubleshooting

### 404 Errors on API Calls

1. **Check Network Tab**: Look for the actual URL being called
2. **Verify Configuration**: Check if `config.js` or `config.json` exists and has correct URL
3. **Check Static Web App Settings**: Verify API_BASE_URL is set in Azure Portal
4. **CORS Issues**: Ensure your Web API allows requests from the Static Web App domain

### Configuration Not Loading

1. **Check Browser Console**: Look for errors loading `config.js`
2. **Verify File Deployment**: Check if `config.js` exists in the deployed Static Web App
3. **Manual Configuration**: Use the Azure Portal method described above

### API Routes Not Working

1. **Check `staticwebapp.config.json`**: Ensure `/api/*` routes are configured correctly
2. **Backend Linking**: Verify the Static Web App is linked to the correct Web API
3. **Permissions**: Ensure API routes have correct `allowedRoles` configuration

## Current Status

✅ **Web API**: Successfully deployed and accessible
✅ **Static Web App**: Deployed and serving frontend
🔧 **API Integration**: Being configured automatically via workflow

The next deployment should automatically configure the API connection between your Static Web App and Web API.
