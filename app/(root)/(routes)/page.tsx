import CharachterCard from "@/components/CharachterCard";

export default function Home() {
  return (
    <div className="bg-white w-full">
      <div>search bar</div>
      <div>Filters</div>
      <div className="grid grid-cols-6 gap-4 p-2">
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
        <CharachterCard />
      </div>
    </div>
  );
}
