import Categories from "@/components/categories";
import { Companions } from "@/components/companions";
import prismadb from "@/lib/prismadb";

interface RootPageProps{
  searchParams: {
    categoryId: string;
    name: string
  }
}

export default async function Home({searchParams}: RootPageProps) {
  const data = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      _count: {
        select: {
          messages: true
        }
      }
    }
  });
  const categories = await prismadb.category.findMany();
  return (
    <div className="h-full space-y-2 p-4">
      {/* <div>search bar</div>
      <div>Filters</div> */}
      <Categories data={categories}/>
      <Companions data={data} />
      <div className="grid grid-cols-6 gap-4 p-2">
        {/* <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard /> */}
      </div>
    </div>
  );
}
