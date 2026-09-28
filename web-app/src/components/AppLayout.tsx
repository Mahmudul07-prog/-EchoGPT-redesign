import { Outlet } from "react-router-dom";
import { Sidebar, MobileSidebarDrawer } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ToastContainer } from "./ToastContainer";
import { AuthModal } from "./AuthModal";

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-light font-body text-text-light dark:bg-bg-dark dark:text-text-dark">
      <Sidebar />
      <MobileSidebarDrawer />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
      <AuthModal />
    </div>
  );
}
