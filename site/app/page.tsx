import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/sections/Hero';
import { Product } from '@/components/sections/Product';
import { SupportedGames } from '@/components/sections/SupportedGames';
import { Demo } from '@/components/sections/Demo';
import { About } from '@/components/sections/About';
import { Story } from '@/components/sections/Story';
import { Team } from '@/components/sections/Team';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Product />
        <SupportedGames />
        <Demo />
        <About />
        <Story />
        <Team />
      </main>
      <Footer />
    </>
  );
}
