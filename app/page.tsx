import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Sorted from "@/components/Sorted";
import Value from "@/components/Value";
import Compare from "@/components/Compare";
import Proof from "@/components/Proof";
import Close from "@/components/Close";
import PageMotion from "@/components/PageMotion";
import QuestionOfTheDay from "@/components/QuestionOfTheDay";
import { getLandingData } from "@/lib/live-data";

export const revalidate = 300;

export default async function Home() {
  const data = await getLandingData();

  return (
    <>
      <Nav />
      {/* The footer still lives inside the closing panel, as the design has it. */}
      <main>
        <Hero data={data} />
        <Sorted data={data} />
        <Value data={data} />
        <Compare />
        <Proof data={data} />
        <Close />
      </main>
      <PageMotion />
      <QuestionOfTheDay data={data} />
      {data.isSample && <p className="sample-badge">Preview data: set OA_PUBLIC_API_URL for live numbers</p>}
    </>
  );
}
