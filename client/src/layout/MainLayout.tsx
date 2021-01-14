import { useLocation } from "react-router-dom";
import { StandardProps } from "../types/types";
import { getRoute } from "./RouterSwitch";

type MainLayoutProps = {} & StandardProps;

function MainLayout({ children, ...props }: MainLayoutProps) {
  const { pathname } = useLocation();
  const currentRoute = getRoute(pathname);

  return (
    <main {...props}>
      <h1>{currentRoute?.name}</h1>
      {children}
    </main>
  );
}

export default MainLayout;
