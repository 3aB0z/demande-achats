import { Outlet } from "react-router-dom";
import Header from "../ui/Header";

function Layout() {
  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-7xl my-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
