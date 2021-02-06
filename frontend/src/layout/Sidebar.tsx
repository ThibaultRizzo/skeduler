import { StandardProps } from "../types/types";
import "../styles/layout/sidebar.scss";
import { useLayoutEffect, useState } from "react";
import sidebarStore from "../store/sidebar.store";
import clsx from "clsx";

type SidebarProps = {} & StandardProps;

function Sidebar({ ...props }: SidebarProps) {
  const [sidebarState, setSidebarState] = useState(sidebarStore.initialState);
  const isSidebarOpen = sidebarState.renderComponent !== null;
  useLayoutEffect(() => {
    sidebarStore.subscribe(setSidebarState);
    sidebarStore.init();
  }, []);

  function closeSidebar() {
    sidebarStore.closeSidebar();
  }
  return (
    <aside {...props} className={clsx({ opened: isSidebarOpen })}>
      <div className="sidebar-wrapper">
        <div className="sidebar-header">
          <h2>{sidebarState.title}</h2>
        </div>
        <div className="sidebar-body">
          {sidebarState.renderComponent && sidebarState.renderComponent()}
        </div>
      </div>
      <div className="sidebar-overlay" onClick={closeSidebar} />
    </aside>
  );
}

export default Sidebar;
