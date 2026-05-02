import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="w-screen h-screen bg-[#121212] font-sans antialiased tracking-tight flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#121212]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
