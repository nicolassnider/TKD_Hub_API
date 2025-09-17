# TKD Hub Web

A web application for managing Taekwondo dojaangs, students, coaches, promotions, and more.

## Features

- **Admin dashboards** for Students, Coaches, Dojaangs, Promotions, and Users
- CRUD operations for all major entities
- Role-based access (Admin, Coach, Student)
- Secure authentication (JWT)
- Responsive UI with modals for editing/creating entities
- Accessible forms and tables

## Tech Stack

- **Frontend:** React (with Next.js App Router)
- **State Management:** React Context
- **Styling:** Bootstrap, Tailwind CSS (optional)
- **API:** Connects to a .NET Core backend (see [API endpoints](#api-endpoints))

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Backend API running (see `.env` for API URL)

### Installation

```bash
git clone https://github.com/your-org/tkd_hub_web.git
cd tkd_hub_web
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_API_BASE_URL=https://localhost:7046/api
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    components/         # Reusable UI components (AdminListPage, selectors, modals, etc.)
    context/            # Auth and Role context providers
    routes/             # Route definitions for navigation
    services/           # Admin pages for each entity (studentsAdmin, coachesAdmin, etc.)
  public/
  styles/
```

## API Endpoints

The frontend expects the following endpoints (examples):

- `POST   /api/Auth/login`
- `GET    /api/Students`
- `GET    /api/Coaches`
- `GET    /api/Dojaang`
- `GET    /api/Promotions`
- `POST   /api/Promotions`
- `PUT    /api/Promotions/{id}`
- `DELETE /api/Promotions/{id}`

See your backend documentation for full details.

## Accessibility

- All forms use proper labels and placeholders.
- Modal backgrounds use external CSS for accessibility.
- Table rows and buttons are keyboard accessible.

## Customization

- To add new admin modules, copy an existing `services/*Admin` page and adjust as needed.
- To add new selectors, see `components/students/StudentSelector.tsx` for a pattern.

## License

MIT

---

**Note:** For development, ensure your backend API has CORS enabled for your frontend URL.
