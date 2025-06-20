
import React from 'react';

interface HijazCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const HijazCard: React.FC<HijazCardProps> = ({ title, icon, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-5 border border-gray-200 ${className}`}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="p-2 rounded-full bg-primary text-white">
          {icon}
        </span>
        <h2 className="text-primary text-xl font-semibold">
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default HijazCard;
