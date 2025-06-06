# TKDHub API & Web

TKDHub is a web-based platform and RESTful API for managing Taekwondo dojaangs (schools), users, coaches, students, events, promotions, ranks, and more. The solution is built with ASP.NET Core (.NET 8), Entity Framework Core, and follows clean architecture principles with separate Application, Domain, Infrastructure, and WebAPI layers.

---

## Features

- **User Management:** Register, authenticate, and manage users with role-based authorization (Admin, Coach, Student).
- **Dojaang Management:** Create, update, delete, and retrieve martial arts schools (dojaangs).
- **Coach & Student Management:** Assign coaches to dojaangs, manage students, and handle their promotions and ranks.
- **Event Management:** Create and manage events, filter by dojaang, coach, user, type, date, and location.
- **Promotion & Rank Management:** Track student promotions and manage rank requirements.
- **Tul (Pattern) Management:** Retrieve and update Tuls, filter by rank.
- **Swagger/OpenAPI:** Interactive API documentation and testing.
- **CORS Support:** Configured for frontend integration.
- **Custom Error Handling:** Consistent error responses via middleware.

---

## Project Structure

- `TKDHubAPI.Application` — Application logic, DTOs, interfaces, and services.
- `TKDHubAPI.Domain` — Domain entities and repository interfaces.
- `TKDHubAPI.Infrastructure` — Data access, EF Core DbContext, repository implementations.
- `TKDHubAPI.WebAPI` — ASP.NET Core Web API controllers, middleware, and startup configuration.
- `frontend/tkd_hub_web` — (If present) React or other frontend client.

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server or another supported database (see your `appsettings.json`)
- Node.js & npm (for frontend, if applicable)

### Setup & Run (API)

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd TKDHubAPI
2. **Configure the database:**
   - Update the connection string in `appsettings.json` as needed.

3. **Apply migrations (auto-applied on startup):**
   - The API will automatically apply any pending EF Core migrations at startup.

4. **Run the API:**
   ```sh
   dotnet run --project src/TKDHubAPI.WebAPI

5. **Access Swagger UI:**
   - Navigate to [https://localhost:5001/swagger](https://localhost:5001/swagger) (or the port shown in your console).

### Setup & Run (Frontend)

If you have a frontend in `frontend/tkd_hub_web`, run:

   ```sh
   cd frontend/tkd_hub_web
   npm install
npm run dev
 ```

 
   

## API Overview

All endpoints are prefixed with `/api/`.  
Authentication is via JWT Bearer tokens.

### Main Endpoints

| Resource   | Endpoint Example                | Methods         | Description                        |
|------------|--------------------------------|-----------------|------------------------------------|
| Auth       | `/api/auth/login`              | POST            | User login, returns JWT           |
| Users      | `/api/users`                   | GET, POST, PUT, DELETE | Manage users                  |
| Dojaangs   | `/api/dojaang`                 | GET, POST, PUT, DELETE | Manage dojaangs               |
| Coaches    | `/api/coaches`                 | GET, POST, PUT, DELETE | Manage coaches and assignments |
| Students   | `/api/students`                | GET, POST, PUT, DELETE | Manage students                |
| Events     | `/api/events`                  | GET, POST, PUT, DELETE | Manage events                  |
| Promotions | `/api/promotions`              | GET, POST, PUT, DELETE | Manage promotions              |
| Ranks      | `/api/ranks`                   | GET, POST, PUT, DELETE | Manage ranks                   |
| Tuls       | `/api/tuls`                    | GET, PUT, DELETE       | Manage Tuls (patterns)         |

> **Note:** Some endpoints require Admin or Coach roles. See Swagger for details.

---

## CORS

CORS is enabled for the frontend.  
Update the allowed origins in your configuration if needed.

---

## Error Handling

All errors are returned in a consistent format via custom middleware.  
Example error response:

   ```json
   {
     "error": "Detailed error message here."
   }
```

## API Documentation

Interactive API docs are available at `/swagger` when the API is running.

## Postman Collection
https://.postman.co/workspace/herramientas~45fc8431-f748-496d-8a4c-412bf74cffb6/collection/148107-2bc03adf-7c18-4829-b77f-e90824db5f37?action=share&creator=148107

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please open an issue or contact the maintainers.
