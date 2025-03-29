import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Import your Navbar component

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
