import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;
