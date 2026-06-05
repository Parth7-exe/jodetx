import React from 'react';
import Image from 'next/image';

export default function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className="relative flex items-center">
      <Image 
        src="/jodetxlong.png" 
        alt="JodeTx Logo" 
        width={180} 
        height={36} 
        priority 
        className={`${className} w-auto object-contain`}
      />
    </div>
  );
}
