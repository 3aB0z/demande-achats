// import { Link } from "react-router-dom";
import reactLogo from "./../../assets/logo.png";

function Header() {
  return (
    <header className="border-primary-50 flex items-center justify-between border-b bg-white px-4 py-2 text-white shadow-sm">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-2">
          <img src={reactLogo} alt="logo" className="size-10" />
          <h1 className="text-primary-500 text-xl font-bold">
            Demande d'Achats
          </h1>
        </div>
        {/* <Link
        to="/new-request"
        className="bg-primary-500 hover:bg-primary-600 rounded px-4 py-2 text-white transition"
      >
        New Request
      </Link> */}
      </div>
    </header>
  );
}

export default Header;
