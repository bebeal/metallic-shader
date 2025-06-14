import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { CardShaders } from '../components/Card';

import blastoise from '../assets/images/blastoise.jpg';
import bulbasaur from '../assets/images/bulbasaur.webp';
import charizard from '../assets/images/charizard.webp';
import cobalt from '../assets/images/cobalt.png';
import copper from '../assets/images/copper.webp';
import oxidizedCopper from '../assets/images/oxidized_copper.webp';

import '../index.css';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
  }, [setMounted]);

  if (!mounted) return null;

  /** Top row cards */
  const cardsMuted = [
    {
      title: 'Cobalt',
      price: '',
      content: cobalt,
      metallicColor: "#5A7A9C", // cobalt blue
      features: ['blue fragment', 'specular glare']
    },
    {
      title: 'Copper',
      price: '',
      content: copper,
      metallicColor: "#B85450", // copper red
      features: ['vertex melt', 'depth fade']
    },
    {
      title: 'Oxidized Copper',
      price: '',
      content: oxidizedCopper,
      metallicColor: "#4A8B5C", // oxidized-copper green
      features: ['noise mask', 'gradient ramp']
    },
  ];

  /** Bottom row cards – more vibrant colors */
  const cardsVibrant = [
    {
      title: 'Blue',
      price: '',
      content: blastoise,
      metallicColor: "#2563EB", // vibrant blue
      features: ['ripple pass', 'normal map']
    },
    {
      title: 'Red',
      price: '',
      content: charizard,
      metallicColor: "#DC2626", // vibrant red
      features: ['heat distortion', 'fire LUT']
    },
    {
      title: 'Green',
      price: '',
      content: bulbasaur,
      metallicColor: "#22C55E", // vibrant green
      features: ['bloom blur', 'uv wrap']
    },
  ];

  const cards = [...cardsMuted, ...cardsVibrant];

  return (
    <div className='h-screen overflow-auto transition-all duration-300 relative'>
      {/* Cards Section – 2x3 Grid */}
      <div className='container mx-auto h-full flex justify-center items-center'>
        <div className='grid grid-cols-3 grid-rows-2 gap-10'>
          {cards.map((card) => (
            <CardShaders key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Index,
});
