import { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { StandardProps } from "../types/types";
import CompanyPage from "./pages/CompanyPage";
import DayPage from "./pages/DayPage";

import EmployeePage from "./pages/EmployeePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import SchedulePage from "./pages/SchedulePage";
import ShiftPage from "./pages/ShiftPage";

type RouteDefinition = {
  component: React.ComponentType<unknown>;
  path: string;
  name?: string;
  isInNav: boolean;
};

export const routes: RouteDefinition[] = [
  {
    component: SchedulePage,
    path: "/schedule",
    name: "Schedule",
    isInNav: true,
  },
  {
    component: CompanyPage,
    path: "/company",
    name: "Company",
    isInNav: true,
  },
  {
    component: EmployeePage,
    path: "/employee",
    name: "Employee",
    isInNav: true,
  },
  {
    component: ShiftPage,
    path: "/shift",
    name: "Shift",
    isInNav: true,
  },
  {
    component: DayPage,
    path: "/day",
    name: "Working day",
    isInNav: true,
  },
  {
    component: LoginPage,
    path: "/login",
    isInNav: false,
  },
  {
    component: NotFoundPage,
    path: "/not-found",
    isInNav: false,
  },
];

export const navRoutes = routes.filter((route) => route.isInNav);
export const getRoute = (path: string) => {
  return routes.find((route) => route.path === path) || null;
};

type RouterSwitchProps = {} & StandardProps;

function RouterSwitch({ ...props }: RouterSwitchProps) {
  const [isUserAuthenticated] = useState(true); // TODO: Add real auth mechanism;

  return (
    <Switch {...props}>
      {routes.map((route) => (
        <Route
          exact
          key={route.path}
          component={route.component}
          path={route.path}
        />
      ))}
      <Route
        path="*"
        render={() => {
          return isUserAuthenticated ? (
            <Redirect to="/schedule" />
          ) : (
              <Redirect to="/login" />
            );
        }}
      />
      {/* Catch-all route */}
    </Switch>
  );
}

export default RouterSwitch;
