import { Link } from "react-router-dom";
import { StandardProps } from "../types/types";
import { navRoutes } from "./RouterSwitch";
import "../styles/layout/navbar.scss";

type NavbarProps = {} & StandardProps;

function Navbar({ ...props }: NavbarProps) {
  return (
    <nav {...props}>
      <ul className="nav-link-list">
        {navRoutes.map((route) => (
          <li key={route.path} className="nav-link">
            <Link to={route.path}>{route.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
