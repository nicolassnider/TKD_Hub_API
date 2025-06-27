import { ServiceRoute } from "../types/ServiceRoute";

const servicesRoutes: ServiceRoute[] = [
  {
    href: "/services/studentsAdmin",
    icon: "bi bi-person-lines-fill",
    label: "Students",
    roles: ["Coach", "Admin"],
  },
  {
    href: "/services/coachesAdmin",
    icon: "bi bi-person-check-fill",
    label: "Coaches",
    roles: ["Coach", "Admin"],
  },
  {
    href: "/services/dojaangsAdmin",
    icon: "bi bi-house-fill",
    label: "Dojaangs",
    roles: ["Coach", "Admin"],
  },
  {
    href: "/services/usersAdmin",
    icon: "bi bi-people-fill",
    label: "Users",
    roles: ["Admin"],
  },
  {
    href: "/services/promotionsAdmin",
    icon: "bi bi-award-fill",
    label: "Promotions",
    roles: ["Coach", "Admin"],
  },
  {
    href: "/services/classesAdmin",
    icon: "bi bi-calendar-week",
    label: "Classes",
    roles: ["Coach", "Admin"],
  },
  {
    href: "/services/dashboardAdmin",
    icon: "bi bi-speedometer2",
    label: "Dashboards",
    roles: ["Coach", "Admin"],
  }
];

export default servicesRoutes;
