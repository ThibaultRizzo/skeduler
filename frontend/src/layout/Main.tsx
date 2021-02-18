import Header from "./Header";
import Navbar from "./Navbar";
import RouterSwitch from "./RouterSwitch";
import "../styles/main.scss";
import MainLayout from "./MainLayout";
import Sidebar from "./Sidebar";
import Snackbar from "./Snackbar";
import { tokenSubject } from "../rxjs/auth.subject";

function Main() {
  // TODO: handle auth mechanisms
  tokenSubject.tryLogin();
  return (
    <div id="layout">
      <Sidebar id="sidebar" />
      <Snackbar id="snackbar" />
      <Header id="header" />
      <Navbar id="navbar" />
      <MainLayout id="main">
        <RouterSwitch />
      </MainLayout>
    </div>
  );
}
export default Main;
