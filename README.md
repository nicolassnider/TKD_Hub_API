# TKD Hub API - Cloud-Native Platform


TKD Hub is a modern cloud-native platform for managing Taekwondo dojaangs (schools), users, coaches, students, events, promotions, and ranks. Built with .NET 8, Entity Framework Core, and Azure Functions, following clean architecture principles.


## 🏗️ **Architecture Overview**


### **Backend (Azure Functions)**
- **Azure Functions v4** - Serverless API endpoints
- **Clean Architecture** - Domain, Application, Infrastructure layers
- **Entity Framework Core** - Data access with SQL Server
- **JWT Authentication** - Secure user authentication
- **MercadoPago Integration** - Payment processing


### **Frontend (React SPA)**
- **Vite + React** - Modern frontend framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **Azure Static Web Apps** - Hosting with integrated Functions


### **Deployment Options**
- **Ultra-Low-Cost**: Static Web Apps with embedded Functions (~$5-15/month)
- **Production-Ready**: Static Web Apps + dedicated Function App (~$18-35/month)


## 📁 **Project Structure**


```
TKD_Hub_API/
├── src/
│   ├── TKDHubAPI.Functions/         ← Azure Functions (API endpoints)
│   ├── TKDHubAPI.Application/       ← Application services & DTOs
│   ├── TKDHubAPI.Domain/           ← Domain entities & interfaces
│   ├── TKDHubAPI.Infrastructure/    ← Data access & repositories
│   └── TKDHubAPI.WebAPI/           ← Traditional Web API (optional)
├── frontend/spa/                    ← React SPA frontend
├── tests/                          ← Unit & integration tests
├── .github/workflows/              ← CI/CD automation
└── sql.data/                       ← Database seed data
```


## ⚡ **Azure Functions API Endpoints**


| **Endpoint** | **Methods** | **Description** |
|-------------|-------------|-----------------|
| `/api/health` | GET | Health check |
| `/api/login` | POST | User authentication |
| `/api/register` | POST | User registration |
| `/api/students` | GET, POST, PUT, DELETE | Student management |
| `/api/coaches` | GET, POST, PUT, DELETE | Coach management |
| `/api/dojaangs` | GET, POST, PUT, DELETE | Dojaang management |
| `/api/classes` | GET, POST | Training class management |
| `/api/blogposts` | GET, POST, PUT, DELETE | Blog post management |
| `/api/ranks` | GET | Rank information |
| `/api/tuls` | GET | Tul (pattern) information |
| `/api/events` | GET, POST, PUT, DELETE | Event management |
| `/api/promotions` | GET, POST, PUT, DELETE | Promotion management |
| `/api/payments/*` | POST | MercadoPago payment processing |


## 🎯 **Features**


- **🔐 Authentication & Authorization** - JWT-based with role management (Admin, Coach, Student)
- **🏫 Dojaang Management** - Complete CRUD operations for martial arts schools
- **👥 User Management** - Students, coaches, and administrators
- **📚 Training Classes** - Class scheduling and student enrollment
- **🏆 Promotions & Rankings** - Belt progression tracking
- **📝 Blog System** - Content management for school updates
- **💰 Payment Processing** - MercadoPago integration for fees
- **📊 Event Management** - Tournaments, competitions, and school events
- **🥋 Tul (Patterns)** - Traditional form reference system
- **☁️ Cloud-Native** - Serverless, scalable, cost-effective


## 🚀 **Quick Start**


### **Prerequisites**


- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) & npm
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- SQL Server (LocalDB works for development)


### **Local Development Setup**


1. **Clone the repository:**
   ```powershell
   git clone https://github.com/nicolassnider/TKD_Hub_API.git
   cd TKD_Hub_API
   ```


2. **Setup the database:**
   ```powershell
   # Update connection string in src/TKDHubAPI.Functions/local.settings.json
   # Migrations will auto-apply on Functions startup
   ```


3. **Build the solution:**
   ```powershell
   dotnet build TKD_Hub_API.sln
   ```


4. **Run Azure Functions locally:**
   ```powershell
   # Using VS Code tasks (recommended)
   Ctrl+Shift+P → "Tasks: Run Task" → "build (functions)"
   
   # Or manually
   cd src/TKDHubAPI.Functions
   func start
   ```


5. **Run the React SPA:**
   ```powershell
   cd frontend/spa
   npm install
   npm run dev
   ```


6. **Access the application:**
   - **Functions API**: `http://localhost:7071/api/health`
   - **React SPA**: `http://localhost:5173`


## ☁️ **Azure Deployment**


### **Automated Deployment (Recommended)**


The project includes GitHub Actions for automatic deployment:


1. **Fork this repository**
2. **Follow the deployment guide**: [AZURE_MANUAL_DEPLOYMENT.MD](AZURE_MANUAL_DEPLOYMENT.MD)
3. **Configure GitHub secrets** for your Azure resources
4. **Push to master** - automatic deployment via GitHub Actions


### **Manual Deployment Options**


**Option A: Ultra-Low-Cost (~$5-15/month)**
- Azure Static Web Apps with embedded Functions
- Perfect for MVPs and small schools


**Option B: Production-Ready (~$18-35/month)**  
- Azure Static Web Apps + dedicated Function App
- Better performance and scalability


See [AZURE_MANUAL_DEPLOYMENT.MD](AZURE_MANUAL_DEPLOYMENT.MD) for detailed instructions.


## 🔧 **Development Tools**


### **VS Code Tasks**
- `Ctrl+Shift+P` → "Tasks: Run Task"
- **build (functions)** - Build Azure Functions
- **clean (functions)** - Clean Functions build
- **publish (functions)** - Publish for deployment


### **Testing**


**🚀 Quick Test Commands:**
```powershell
# Run all tests (recommended)
dotnet test


# Run specific test project
dotnet test tests/TKDHubAPI.Application.Test


# Run tests with coverage
dotnet test --collect "XPlat Code Coverage" --settings coverlet.runsettings


# Run tests in watch mode (continuous testing)
dotnet watch test
```


**📋 VS Code Tasks (Ctrl+Shift+P → "Tasks: Run Task"):**
- **test** - Run all tests (default test task)
- **test with coverage** - Run tests with code coverage collection
- **test (watch)** - Run tests in watch mode
- **clean test results** - Clean test result files


**🎯 Advanced Test Runner:**
```powershell
# Use the custom test runner script for enhanced output
.\run-tests.ps1                    # Run all tests
.\run-tests.ps1 -Coverage          # Run with coverage
.\run-tests.ps1 -Watch             # Watch mode
.\run-tests.ps1 -Filter "DojaangService"  # Filter specific tests
.\run-tests.ps1 -Help              # Show all options
```


**🔄 GitHub Actions:**
- **Manual trigger**: Go to Actions → "Run Tests" → "Run workflow"
- **Automatic**: Tests run on push/PR to master/develop branches
- **Coverage reports**: Generated and uploaded as artifacts
- **Security scanning**: Automated vulnerability scanning with Trivy


### **Database Migrations**
```powershell
# Add new migration
dotnet ef migrations add MigrationName --project src/TKDHubAPI.Infrastructure


# Update database
dotnet ef database update --project src/TKDHubAPI.Infrastructure
```


## 🛠️ **Configuration**


### **Environment Variables**


**Azure Functions (`local.settings.json`):**
```json
{
  "Values": {
    "DefaultConnection": "Server=.;Database=TkdHubDb;Trusted_Connection=true;",
    "JWT_SECRET": "your-jwt-secret-key",
    "MercadoPago__AccessToken": "your-access-token",
    "MercadoPago__PublicKey": "your-public-key"
  }
}
```


**React SPA (`.env`):**
```properties
VITE_PUBLIC_API_URL=http://localhost:7071
API_HOST=http://localhost:7071
```


## 🔍 **Troubleshooting**


### **Common Issues**


**Functions not starting:**
```powershell
# Check if port is in use
netstat -an | findstr 7071


# Kill process using the port
Get-Process | Where-Object {$_.ProcessName -eq "func"} | Stop-Process
```


**Database connection issues:**
- Verify SQL Server is running
- Check connection string format
- Ensure database exists (auto-created on first run)


**Build failures:**
```powershell
# Clean and rebuild
dotnet clean
dotnet build
```


**CORS issues:**
- Ensure API URL is correct in `.env`
- Check Functions CORS configuration
- Verify Static Web Apps integration


## 📚 **Additional Resources**


- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Static Web Apps Guide](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Clean Architecture Principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Entity Framework Core Docs](https://docs.microsoft.com/en-us/ef/core/)


## 🤝 **Contributing**


1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and add tests
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**


## 📄 **License**


This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.


---


**🥋 Built for the Taekwondo community with ❤️**
