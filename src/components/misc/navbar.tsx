import NorthwesternLogo from "./northwestern-logo";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center sm:px-8 px-4 py-4 border-b">
      <div className="flex items-center gap-3">
        <NorthwesternLogo height={36} width={23.51} />
        <h3 className="text-2xl font-bold block text-nowrap">IDP Scheduler</h3>
      </div>
    </nav>
  );
}
