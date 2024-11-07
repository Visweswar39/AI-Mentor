import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="h-full">
      <Navbar />
      <main className="bg-red-300 flex flex-row h-full">
        <div className="hidden md:flex bg-blue-300 h-screen w-20 flex-col">
          <Sidebar/>
        </div>
        {children}
      </main>
    </div>
  );
}
