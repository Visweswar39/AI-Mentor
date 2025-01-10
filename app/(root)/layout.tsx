import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
// import { checkSubscription } from "@/lib/subscription"

export default async function Layout({children}: {children: React.ReactNode}) {
  // const isPro = await checkSubscription();
  return (
    <div className="h-full">
      <Navbar />
      <div className="fixed inset-y-0 mt-16 hidden h-full w-20 flex-col md:flex">
        <Sidebar isPro={true}/>
      </div>
      <main className="h-full pt-16 md:pl-20">
        {children}
      </main>
    </div>
  );
}
