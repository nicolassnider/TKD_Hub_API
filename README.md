# TKDHub API & Web

TKDHub is a web-based platform and RESTful API for managing Taekwondo dojaangs (schools), users, coaches, students, events, promotions, ranks, and more. The solution is built with ASP.NET Core (.NET 8), Entity Framework Core, and follows clean architecture principles with separate Application, Domain, Infrastructure, and WebAPI layers.

## Docker / Local dev

There are example Dockerfiles for the API and the frontend in the project root proposals. To run both services locally for development, prefer using the `dotnet` and `npm` commands directly, or create a `docker-compose.yml` that wires the API, a SQL Server container, and the frontend.

Key notes:

- The Web API is under `src/TKDHubAPI.WebAPI`.
- The Next.js frontend is under `frontend/tkd_hub_web`.
- Database migrations live in the API project under `src/TKDHubAPI.Infrastructure/Migrations` (run via `dotnet ef database update` or the startup migration runner).

If you plan to deploy, keep MercadoPago secret keys on the server and only expose the public key to the browser (see frontend README).

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
   ```

2. **Configure the database:**

   - Update the connection string in `appsettings.json` as needed.

3. **Apply migrations (auto-applied on startup):**

   - The API will automatically apply any pending EF Core migrations at startup.

4. **Run the API:**

   ```sh
   dotnet run --project src/TKDHubAPI.WebAPI
   ```

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

# TKDHub — API & Frontends (overview)

TKDHub is a web platform and RESTful API for managing Taekwondo dojaangs (schools), users, coaches, students, events, promotions, ranks, and more. The solution uses .NET 8, EF Core and follows a layered/clean architecture (Domain / Application / Infrastructure / WebAPI).

This README focuses on developer setup and quick troubleshooting for the backend and the included frontends.

## Quick facts

- Web API: `src/TKDHubAPI.WebAPI`
- Vite SPA (React): `frontend/spa`
- Next.js web (optional): `frontend/tkd_hub_web`
- Tests: `tests/TKDHubAPI.Application.Test`
- Migrations: `src/TKDHubAPI.Infrastructure/Migrations`

## Prerequisites

- .NET 8 SDK
- Node.js + npm (for building the SPA)
- SQL Server (or another supported DB; update `appsettings.*.json` accordingly)

## Local development — API

1. Restore and build the solution

```powershell
dotnet restore "TKD_Hub_API.sln"
dotnet build "TKD_Hub_API.sln"
```

2. Run the API

```powershell
dotnet run --project src\TKDHubAPI.WebAPI\TKDHubAPI.WebAPI.csproj
```

The Web API will apply EF Core migrations at startup if configured. Watch the console output for the listening port and open `/swagger` (e.g. `https://localhost:5001/swagger`).

Notes

- Authentication: JWT Bearer tokens. Many endpoints are role-protected (Admin/Coach/Student).
- Endpoint prefix: `/api/`

## Local development — SPA (Vite)

This repository contains a Vite + React SPA at `frontend/spa`. The Vite build is configured to output production assets directly into the API `wwwroot` folder so the API can serve the built SPA.

Build steps for the SPA

```powershell
cd frontend\spa
npm install
npm run build
```

After a successful build, the production files are emitted to `src\TKDHubAPI.WebAPI\wwwroot` (check `vite.config.ts` if you changed the config). Run the API and it will serve the SPA static assets.

For local frontend development you can run the SPA dev server (it runs on its own port):

```powershell
npm run dev
```

If you want the SPA and API served from the same origin locally, run the SPA build and then run the API.

## Swagger / OpenAPI

- Swagger UI is available at `/swagger` while the API is running.
- A custom OpenAPI DocumentFilter is included to hide endpoints that are `[Obsolete]` or marked with `ApiExplorerSettings(IgnoreApi = true)`. If you add endpoints and they don't show up, check those attributes and the filter behavior in `src/TKDHubAPI.WebAPI/Swagger`.

## Events API notes

- The application layer includes `Event` entities, DTOs, mappings and `IEventService`/`EventService`.
- The WebAPI exposes an `EventsController` that provides CRUD and filter endpoints and calls `ICurrentUserService` to provide a `User` into admin-guarded service methods.
- If you need attendance-specific responses (for example: event + list of attendees), add a service method like `GetEventWithAttendanceByIdAsync(int id)` and implement it in the `EventService` and the repository — I can add that on request.

## Troubleshooting

- Build fails because file is in use (locked exe)

  Error example:

  - MSB3027: Could not copy "...TKDHubAPI.WebAPI.exe" to "...bin\Debug\net8.0\TKDHubAPI.WebAPI.exe": The process cannot access the file because it is being used by another process.

  This happens when a previous `dotnet run` or debugger is still running and has a lock on the apphost. To resolve on Windows (PowerShell):

  ```powershell
  # List dotnet processes (inspect Path to identify WebAPI instance)
  Get-Process dotnet | Select-Object Id, Path, ProcessName

  # Stop a specific process (use the Id from the previous command)
  Stop-Process -Id <PID>

  # Or stop by name (if process is an .exe with the project name)
  Get-Process -Name TKDHubAPI.WebAPI -ErrorAction SilentlyContinue | Stop-Process
  ```

  Or use Task Manager to find and kill the running `TKDHubAPI.WebAPI` process.

- Swagger hides endpoints unexpectedly

  - Check for `[Obsolete]` or `ApiExplorerSettings(IgnoreApi = true)` on controllers/actions.
  - The custom filter removes operations by method name; if you use custom OperationIds the filter may not match — review `src/TKDHubAPI.WebAPI/Swagger/HiddenEndpointsDocumentFilter.cs`.

## Tests

Run application-layer unit tests:

```powershell
dotnet test tests\TKDHubAPI.Application.Test\TKDHubAPI.Application.Test.csproj
```

## Quick dev checklist

- Update `appsettings.*.json` connection string.
- Build and run the API.
- Build the SPA into `wwwroot` if you need same-origin hosting.
- Use `/swagger` to exercise endpoints.

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Add tests when relevant.
4. Open a PR and reference the issue.

---

If you'd like, I can:

- Stop the running WebAPI instance and run the API for an end-to-end check (Swagger, /api/Events).
- Add a dedicated `GetEventWithAttendanceByIdAsync` service + repo method and wire a controller endpoint to return attendance lists.

Last updated: 2025-09-17
