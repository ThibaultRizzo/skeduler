import { StandardProps } from "../types/types";
import "../styles/layout/header.scss";

type HeaderProps = {} & StandardProps;

function Header({ ...props }: HeaderProps) {
  return (
    <header {...props}>
      <h1>Skeduler Project</h1>
    </header>
  );
}

export default Header;
