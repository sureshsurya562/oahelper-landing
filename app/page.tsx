import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Sorted from "@/components/Sorted";
import Value from "@/components/Value";
import Compare from "@/components/Compare";
import Proof from "@/components/Proof";
import Voices from "@/components/Voices";
import Close from "@/components/Close";
import Footer from "@/components/Footer";
import { getLandingData } from "@/lib/live-data";

export const revalidate = 300;

export default async function Home() {
  const data = await getLandingData();

  return (
    <>
      <Nav />
      <main>
        <Hero data={data} />
        <Sorted data={data} />
        <Value data={data} />
        <Compare />
        <Proof />
        <Voices />
        <Close />
      </main>
      <Footer />
      {data.isSample && <p className="sample-badge">Preview data: set OA_PUBLIC_API_URL for live numbers</p>}
    </>
  );
}
