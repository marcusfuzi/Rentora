import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export function initLenis() {
  if (typeof window === 'undefined') return null;

  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenisInstance = lenis;

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  const ticker = (time) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function scrollToSection(targetId) {
  if (!targetId) return;
  const el = document.querySelector(targetId);
  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -40, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
