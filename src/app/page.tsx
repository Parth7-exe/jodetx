'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[450px] items-center justify-center">
      <div className="h-10 w-10 animate-pulse rounded-full bg-cyan-200/50" />
    </div>
  ),
});

const SERVICES = [
  {
    name: 'ReconX',
    subtitle: 'Reconciliation Engine',
    description: 'Smart automated bank reconciliation with real-time insights. Reconcile ledger accounts and sync payments automatically.',
  },
  {
    name: 'CheckOut',
    subtitle: 'Unified Checkouts',
    description: 'A secure unified platform to pay, recharge, and manage services. Fast guest checkout loops and card storage tokens.',
  },
  {
    name: 'Payment Gateway',
    subtitle: 'Transaction Gateways',
    description: 'Instant and seamless payouts with IMPS and UPI integrations. Real-time merchant processing networks built for absolute throughput.',
  },
  {
    name: 'Merchant Mobile App',
    subtitle: 'Mobile Payments Console',
    description: 'Retarget customers and drive conversions through mobile engagement. In-app checkout links, push analytics, and invoice drafts.',
  },
  {
    name: 'Connected Banking',
    subtitle: 'Integrated Banking Infrastructure',
    description: 'Integrated banking infrastructure for seamless financial operations. Clear accounts, verify identities, and manage virtual ledger spaces.',
  },
  {
    name: 'Payment Partner',
    subtitle: 'PA-Agnostic Engine',
    description: 'PA-agnostic offers engine to create and manage campaigns. Direct cashbacks, coupon payouts, and credit partner integrations.',
  },
  {
    name: 'Payment Orchestration',
    subtitle: 'Dynamic Transaction Routing',
    description: 'Smart routing and orchestration layer for payment optimization. Reduce transaction drop rates and route payments through optimal gateways dynamically.',
  },
  {
    name: 'Travel API',
    subtitle: 'Booking API Suite',
    description: 'API suite for travel booking, integrations, and automation. Instantly retrieve live flight paths, hotels, and tourist booking registers.',
  },
  {
    name: 'Payment Links & Forms',
    subtitle: 'No-Code Billing Links',
    description: 'Create and send payment links and forms without coding. Share instant links via SMS or email invoice alerts in one click.',
  },
  {
    name: 'Education ERP',
    subtitle: 'Institution ERP Systems',
    description: 'Comprehensive ERP solution for schools, colleges, and institutes. Coordinate fee billing cycles, student profiles, and administrative panels.',
  },
  {
    name: 'Housing Society ERP',
    subtitle: 'Community Management',
    description: 'Smart society management platform for residents and committees. Automate billing, maintenance tickets, and gate pass clearances.',
  },
  {
    name: 'B2B Solution',
    subtitle: 'Enterprise Workflows',
    description: 'End-to-end business management and enterprise workflow solutions. Orchestrate supply chain invoicing, vendor ledger details, and audit tracks.',
  },
  {
    name: 'RewardX',
    subtitle: 'Rewards & Engagement Platform',
    description: 'Rewards, cashback, and customer engagement management platform. Deploy interactive loyalty campaigns and point systems.',
  },
  {
    name: 'Saloonz',
    subtitle: 'Smart Retail & Appointment ERP',
    description: 'Smart salon and appointment management ERP for modern retail businesses. Bookings, inventory tracks, and customer engagement structures.',
  },
  {
    name: 'TempleG',
    subtitle: 'Donations & Temple Management',
    description: 'Temple management platform for donations, events, and devotees. Digitize charity receipts, ritual bookings, and festival schedules.',
  },
  {
    name: 'PigmyX',
    subtitle: 'Agent Collection Management',
    description: 'Digital pigmy collection and agent-based deposit management system. Secure micro-finance tracking and ledger synchronizations.',
  },
  {
    name: 'ParkingX',
    subtitle: 'Parking & Gate Clearances',
    description: 'Parking operations and vehicle entry management solution. Automated license plate scans and vehicle security logs.',
  },
  {
    name: 'StoryBox',
    subtitle: 'Creative Media Streaming',
    description: 'Movie discovery and streaming-style website. Showcase trailers, metadata, genres, and media assets in a dark cinematic interface.',
  },
];

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active index matching the Scene controller math
  const activeIndex = (() => {
    if (scrollProgress < 0.05) return -1;
    const numServices = 18;
    const segment = (scrollProgress - 0.05) / (0.90 / numServices);
    const idx = Math.floor(segment);
    return idx >= 0 && idx < numServices ? idx : (idx >= numServices ? numServices - 1 : -1);
  })();

  const t = Math.min(scrollProgress / 0.04, 1);
  const canvasBlur = (1 - t) * 3; // Starts at 3px blur and gets clear as scroll progress reaches 0.04

  return (
    <div className="relative min-h-[6000vh] bg-white text-zinc-900 font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      {/* 1. Viewport-Fixed Background 3D Canvas */}
      <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
        <Scene />
      </div>

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] cyan-glow pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] cyan-glow pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 md:px-8 py-3 md:py-4 backdrop-blur-md bg-white/40 border-b border-zinc-200/50">
        <div className="flex items-center">
          <Logo className="h-6 md:h-8 w-auto" />
        </div>
        <nav className="hidden space-x-6 lg:space-x-8 md:flex text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <span className={`transition-all duration-300 ${activeIndex >= 0 && activeIndex <= 8 ? 'text-cyan-600 font-bold scale-105' : ''}`}>Financial Modules</span>
          <span className="text-zinc-200">|</span>
          <span className={`transition-all duration-300 ${activeIndex >= 9 && activeIndex <= 17 ? 'text-cyan-600 font-bold scale-105' : ''}`}>ERP Ecosystem</span>
        </nav>
        <div>
          <button className="px-3.5 py-1.5 md:px-5 md:py-2 text-[10px] md:text-xs font-semibold rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 transition-all hover:border-cyan-400 shadow-sm text-zinc-800">
            Launch Console
          </button>
        </div>
      </header>

      {/* FIXED VIEWPORT EDITORIAL STORYTELLING NARRATIVES */}
      <div className="fixed inset-0 z-10 flex items-center p-4 md:p-16 lg:p-24 pointer-events-none">
        <div className="w-full max-w-7xl mx-auto relative h-[75vh] md:h-[60vh] flex items-end md:items-center">
          
          {SERVICES.map((service, idx) => {
            const isVisible = activeIndex === idx;
            const isEven = idx % 2 === 0;
            
            // Mobile: Centered floating glass card at the bottom of the viewport (slightly higher up to avoid indicator)
            // Desktop: Alternating left/right positioning
            const layoutClass = isEven
              ? 'left-4 right-4 bottom-20 md:bottom-auto md:left-0 md:right-auto md:mx-0'
              : 'left-4 right-4 bottom-20 md:bottom-auto md:left-auto md:right-0 md:mx-0';

            const transitionClass = isVisible
              ? 'opacity-100 translate-y-0 md:translate-x-0 pointer-events-auto'
              : `opacity-0 translate-y-8 md:translate-y-0 md:${isEven ? '-translate-x-12' : 'translate-x-12'} pointer-events-none`;

            return (
              <div 
                key={idx}
                className={`absolute ${layoutClass} w-[calc(100%-2rem)] max-w-md md:w-full md:max-w-xl p-6 md:p-0 bg-white/80 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none border border-zinc-200/50 md:border-none rounded-3xl md:rounded-none shadow-xl md:shadow-none space-y-4 md:space-y-5 transition-all duration-700 ease-out ${transitionClass}`}
              >
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-700 bg-cyan-50 border border-cyan-200/50">
                    Module {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                    {service.subtitle}
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-zinc-950 text-center md:text-left">
                  {service.name.split(' ').map((word, wIdx) => {
                    const isLast = wIdx === service.name.split(' ').length - 1;
                    return (
                      <span key={wIdx} className={isLast ? "font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400" : ""}>
                        {word}{' '}
                      </span>
                    );
                  })}
                </h2>

                <p className="text-sm md:text-base text-zinc-500 font-light leading-relaxed text-center md:text-left">
                  {service.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2 md:pt-4 justify-center md:justify-start">
                  <button className="h-10 px-6 rounded-full bg-zinc-950 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-md">
                    Request API Integration
                  </button>
                  <a href="https://jodetx.com" target="_blank" rel="noreferrer" className="text-xs font-bold text-cyan-600 hover:text-cyan-800 transition-colors flex items-center justify-center sm:justify-start">
                    Learn More →
                  </a>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Floating Bottom Nav Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center p-1 rounded-full bg-white/80 backdrop-blur-md border border-zinc-200/50 shadow-sm max-w-full select-none">
        {/* Mobile: Compact Pill Indicator */}
        <div className="flex md:hidden px-3.5 py-1.5 text-xs font-semibold text-zinc-700 items-center space-x-2">
          <span className="text-cyan-600 font-bold">{activeIndex >= 0 ? (activeIndex + 1 < 10 ? `0${activeIndex + 1}` : activeIndex + 1) : '--'}</span>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-400 font-medium">18</span>
          {activeIndex >= 0 && (
            <>
              <span className="text-zinc-200">|</span>
              <span className="text-zinc-600 font-bold max-w-[120px] truncate">{SERVICES[activeIndex].name}</span>
            </>
          )}
        </div>

        {/* Desktop: Dots Indicator */}
        <div className="hidden md:flex space-x-1.5 p-2">
          {SERVICES.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeIndex === idx ? 'w-6 bg-cyan-500' : 'w-1.5 bg-zinc-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-zinc-400 z-10 pointer-events-none">
        © {new Date().getFullYear()} JodeTx Labs. Cryptographically optimized for enterprise custody.
      </div>
    </div>
  );
}
