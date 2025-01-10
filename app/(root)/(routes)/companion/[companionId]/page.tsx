import prismadb from "@/lib/prismadb";
import { CompanionForm } from "./components/companion-form";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface CompanionIdPageProps{
    params: {
        companionId: string;
    }
}

const prisma = prismadb;

const CompanionIdPage = async ({params}: CompanionIdPageProps) =>{
    const user = await currentUser();

    if(!user?.id){
        return redirect("/");
    }
    // TODO: check subscription

    const companion = await prisma.companion.findUnique({
        where: {
            id: params.companionId,
            userId: user.id
        }
    });

    const categories = await prisma.category.findMany();

    return(
        <CompanionForm
            initialData = {companion}
            categories = {categories}
        />
    )
}
export default CompanionIdPage;