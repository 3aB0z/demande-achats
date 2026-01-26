import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <main className="mx-auto h-screen w-screen max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
