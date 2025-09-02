import { Link } from "@tanstack/react-router";
import NorthwesternLogo from "./northwestern-logo";

export default function Navbar() {
  return (
    <nav className="w-full h-16 flex justify-between items-center sm:px-8 px-4 py-4 border-b">
      <div className="flex items-center gap-3">
        <NorthwesternLogo height={32} width={20.5} />
        <h3 className="text-2xl font-bold block text-nowrap">IDP Scheduler</h3>
      </div>
      <div className="flex gap-4">
        <Link to="/" className="[&.active]:font-bold">
          Players
        </Link>
        <Link to="/schedule" className="[&.active]:font-bold">
          Schedule
        </Link>
      </div>
    </nav>
  );
}
