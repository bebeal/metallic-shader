import React from "react";

export interface CardProps {
  title: string;
  price: string;
  features?: string[];
  children?: React.ReactNode;
  content: string | React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  price,
  features = [],
  content,
  children,
}) => {
  return (
    <div className="relative w-56 aspect-[63/88] bg-neutral-800 rounded-md p-2 shadow-lg flex flex-col border border-neutral-600">
      {/* Card Header */}
      <header className="p-1 bg-transparent text-md text-slate-100 flex justify-between items-center font-extrabold">
        <span className="truncate max-w-[10rem] [text-shadow:-0.5px_0_#000,0_0.5px_#000,0.5px_0_#000,0_-0.5px_#000]" title={title}>{title}</span>
        <span className="[text-shadow:-0.5px_0_#000,0_0.5px_#000,0.5px_0_#000,0_-0.5px_#000]">{price}</span>
      </header>
      {/* Inner Card Container */}
      <div className="rounded-md overflow-hidden relative w-full h-full flex flex-col items-center justify-start p-4 gap-2 border border-neutral-600">
        {children}
        {/* Card Content */}
        <div className="bg-transparent rounded-md flex items-center justify-center w-auto h-30 relative z-10 overflow-hidden">
          {typeof content === 'string' ? <img src={content} alt={title} className="object-fill w-full h-full" /> : content}
        </div>
        {/* Feature list */}
        {features && (
          <ul className="w-full mt-2 space-y-1 text-sm text-slate-300 relative z-10 font-bold leading-tight">
            {features.map((feature) => (
              <li key={feature} title={feature} className="flex items-center gap-1 truncate align-middle">
                <span className="relative -top-[1px] [text-shadow:-0.5px_0_#000,0_0.5px_#000,0.5px_0_#000,0_-0.5px_#000]">•</span>
                <span className="[text-shadow:-0.5px_0_#000,0_0.5px_#000,0.5px_0_#000,0_-0.5px_#000]">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Card Footer */}
      <footer className="p-1 bg-transparent text-xs text-slate-400" />
    </div>
  );
};
