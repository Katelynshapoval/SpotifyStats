import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden overflow-y-auto text-text">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col bg-background">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 bg-surface-alt text-lg font-semibold text-white">
          <img src="logo.ico" alt="logo" className="h-6 w-6" />
          <span>Spotify Stats</span>
        </header>
        {/* Page content */}
        <div className="p-6 flex-1 bg-surface-base text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
