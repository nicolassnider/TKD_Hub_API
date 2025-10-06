# 💰 FREE TIER Deployment Option

## Cost Comparison

| Component | **Standard Deployment** | **FREE TIER Deployment** | Monthly Savings |
|-----------|-------------------------|---------------------------|-----------------|
| **Web App** | S1 Standard (~$73/month) | F1 Free ($0/month) | **$73** |
| **Static Web App** | Free | Free | $0 |
| **SQL Database** | Basic (~$5/month) | Basic (~$5/month) | $0 |
| **Key Vault** | ~$1/month | None (secrets in app settings) | **$1** |
| **Application Insights** | ~$2/month | None | **$2** |
| **Storage Account** | Standard LRS (~$1/month) | Standard LRS (~$0.50/month) | **$0.50** |
| **Total** | **~$82/month** | **~$5.50/month** | **$76.50/month** |

## 🎯 What You Get (FREE TIER)

### ✅ **Included Features**
- ✅ Full Web API functionality
- ✅ React/Vue frontend 
- ✅ SQL Database (2GB storage)
- ✅ JWT Authentication
- ✅ User management
- ✅ All CRUD operations
- ✅ CORS configuration
- ✅ HTTPS encryption
- ✅ Custom domain support (Static Web App)

### ⚠️ **FREE TIER Limitations**
- 🔄 **App sleeps after 20 minutes** of inactivity (30-60 second cold start)
- ⏱️ **165 minutes/day** compute time limit
- 💾 **1GB** total storage for web app
- 🚫 **No Key Vault** (secrets stored in app settings - less secure but functional)
- 🚫 **No Application Insights** (no advanced monitoring)
- 🚫 **No custom SSL** for web app (Static Web App still gets SSL)
- 🚫 **No always-on** capability

### 💡 **Perfect For**
- 🧪 **Development and testing**
- 📚 **Learning and prototyping**  
- 🏫 **Small school demos** (under 100 users)
- 💰 **Budget-conscious deployments**
- 🎓 **Student projects**

## 🚀 Setup Instructions

### 1. Required GitHub Secrets (FREE TIER)

```bash
# Azure Authentication (same as standard)
AZURE_CLIENT_ID=<service-principal-client-id>
AZURE_TENANT_ID=<azure-ad-tenant-id>
AZURE_SUBSCRIPTION_ID=<azure-subscription-id>

# FREE TIER Resources (different names to avoid conflicts)
AZURE_RG_NAME_FREE=tkd-hub-free-rg
APP_NAME_FREE=tkdhubfree

# Database (same as standard)
SQL_ADMIN_LOGIN=sqladmin
SQL_ADMIN_PASSWORD=MyStrongP@ssw0rd123!

# Initial Admin (same as standard)
GRANDMASTER_EMAIL=admin@tkdhub.com
GRANDMASTER_PASSWORD=AdminP@ssw0rd123!

# Optional customization (same as standard)
JWT_KEY=<optional-jwt-key>
DOJANG_NAME="My School (Free Tier)"
DOJANG_ADDRESS="123 Training Way"
DOJANG_LOCATION="My City"
DOJANG_PHONE="555-123-4567" 
DOJANG_EMAIL="info@myschool.com"
GRANDMASTER_FIRST_NAME="Master"
GRANDMASTER_LAST_NAME="Smith"
```

### 2. Create Free Tier Branch

```bash
# Create a new branch for free tier deployment
git checkout -b free-tier
git push origin free-tier
```

### 3. Deploy

Push changes to the `free-tier` branch or use manual workflow dispatch to deploy the FREE TIER version.

## 🔄 Switching Between Versions

### Deploy Standard Version
```bash
git checkout main
# Push changes triggers standard deployment
git push origin main
```

### Deploy FREE TIER Version
```bash
git checkout free-tier  
# Push changes triggers free tier deployment
git push origin free-tier
```

### Manual Deployment
Use GitHub Actions workflow dispatch:
- **Standard**: Select `deploy-azure.yml` workflow
- **FREE TIER**: Select `deploy-azure-free.yml` workflow

## 🛠️ Technical Differences

### Infrastructure Changes
| Feature | Standard | FREE TIER |
|---------|----------|-----------|
| **App Service Plan** | S1 Standard (Linux) | F1 Free (Windows) |
| **Key Vault** | ✅ All secrets secured | ❌ Secrets in app settings |
| **Application Insights** | ✅ Full monitoring | ❌ Basic logging only |
| **Managed Identity** | ✅ For Key Vault access | ❌ SQL auth only |
| **Always On** | ✅ No cold starts | ❌ Sleeps after 20 minutes |
| **Custom Domains** | ✅ With SSL certificates | ⚠️ Static Web App only |

### Security Considerations
- **Standard**: Enterprise-grade security with Key Vault
- **FREE TIER**: Basic security with encrypted app settings

### Performance Expectations
- **Standard**: Production-ready performance
- **FREE TIER**: Development/testing performance with cold starts

## 📊 Usage Monitoring

### FREE TIER Quotas to Watch
```bash
# Check quota usage
az webapp show --name <app-name> --resource-group <rg-name> --query "siteConfig.dailyMemoryTimeQuota"

# Monitor compute time usage
az monitor metrics list \
  --resource <web-app-resource-id> \
  --metric "CpuTime" \
  --interval PT1H
```

### Optimization Tips for FREE TIER
1. **Minimize cold starts**: Keep the app "warm" with periodic pings
2. **Optimize bundle size**: Smaller deployments = faster startup
3. **Use caching**: Reduce database calls to stay within compute limits
4. **Monitor quotas**: Watch daily compute time usage

## 🚀 Upgrade Path

When ready to upgrade from FREE TIER to Standard:

1. **Switch branches**: `git checkout main`
2. **Update secrets**: Use standard secret names (without `_FREE` suffix)
3. **Deploy**: Push to main branch triggers standard deployment
4. **Migrate data**: Database remains the same (no migration needed)

## 🎉 Summary

The **FREE TIER deployment** gives you:
- 💰 **93% cost reduction** ($82 → $5.50/month)
- 🚀 **Full application functionality**
- 🧪 **Perfect for development/testing**
- 📈 **Easy upgrade path to production**

**Total monthly cost: ~$5.50** (just the SQL Database!)

Perfect for getting started without the enterprise overhead! 🎯
