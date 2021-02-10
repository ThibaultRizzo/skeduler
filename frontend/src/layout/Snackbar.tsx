import { StandardProps } from "../types/types";
import "../styles/layout/sidebar.scss";
import { useLayoutEffect, useState } from "react";
import snackbarSubject from "../rxjs/snackbar.subject";
import clsx from "clsx";

type SnackbarProps = {} & StandardProps;

function Snackbar({ ...props }: SnackbarProps) {
  const [snackbarState, setSnackbarState] = useState(
    snackbarSubject.initialState
  );
  const isSnackbarOpen = snackbarState.title !== "";
  useLayoutEffect(() => {
    const sub = snackbarSubject.subscribe(setSnackbarState);
    snackbarSubject.init();
    return function cleanup() {
      sub.unsubscribe();
    };
  }, []);
  return (
    <aside
      {...props}
      className={clsx({
        opened: isSnackbarOpen,
        [snackbarState.level || ""]: snackbarState.level,
      })}
    >
      <div className="snackbar-header">
        <h2>{snackbarState.title}</h2>
      </div>
      {snackbarState.message && (
        <div className="sidebar-body">{snackbarState.message}</div>
      )}
    </aside>
  );
}

export default Snackbar;
