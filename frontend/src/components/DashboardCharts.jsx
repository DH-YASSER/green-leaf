import React from 'react';

/**
 * Revenue Trend Chart - A beautiful SVG Area chart with smooth lines and gradients
 */
export const RevenueTrendChart = ({ data = [] }) => {
  // Fallback data if none provided
  const chartData = data.length > 0 ? data : [
    { label: 'Mon', value: 0 },
    { label: 'Tue', value: 200 },
    { label: 'Wed', value: 150 },
    { label: 'Thu', value: 480 },
    { label: 'Fri', value: 300 },
    { label: 'Sat', value: 600 },
    { label: 'Sun', value: 850 }
  ];

  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...chartData.map(d => d.value), 100) * 1.1; // 10% padding on top
  const points = chartData.map((d, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.value / maxVal) * (height - paddingY * 2);
    return { x, y, label: d.label, value: d.value };
  });

  // Generate SVG path for line
  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    // Use bezier curves for smoothing
    const prev = points[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  // Generate SVG path for gradient area under the line
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider">Revenue Trend / Évolution</h4>
          <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Weekly revenue overview (MAD)</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-accent bg-brand-highlight/20 px-2 py-0.5 rounded-full border border-brand-accent/10">
          <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
          Live Stats
        </div>
      </div>

      <div className="relative w-full h-[220px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-accent)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-brand-accent)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-brand-secondary)" />
              <stop offset="100%" stopColor="var(--color-brand-accent)" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
            const y = paddingY + r * (height - paddingY * 2);
            const val = Math.round(maxVal * (1 - r));
            return (
              <g key={i} className="opacity-40">
                <line 
                  x1={paddingX} 
                  y1={y} 
                  x2={width - paddingX} 
                  y2={y} 
                  stroke="#e2e8f0" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingX - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-[10px] font-bold fill-slate-400"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Gradient Fill Area */}
          {areaPath && (
            <path d={areaPath} fill="url(#areaGrad)" className="transition-all duration-700 ease-out" />
          )}

          {/* Stroke Line */}
          {linePath && (
            <path 
              d={linePath} 
              fill="none" 
              stroke="url(#lineGrad)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              {/* Pulsing ring on hover */}
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="8" 
                fill="var(--color-brand-accent)" 
                className="opacity-0 group-hover:opacity-20 transition-all duration-300 transform scale-150"
              />
              {/* Point circle */}
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="4.5" 
                fill="#ffffff" 
                stroke="var(--color-brand-secondary)" 
                strokeWidth="3" 
                className="transition-all duration-300"
              />
              {/* Tooltip value */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect 
                  x={p.x - 35} 
                  y={p.y - 30} 
                  width="70" 
                  height="22" 
                  rx="6" 
                  fill="var(--color-brand-primary)" 
                />
                <text 
                  x={p.x} 
                  y={p.y - 15} 
                  textAnchor="middle" 
                  className="text-[10px] font-bold fill-white"
                >
                  {p.value} MAD
                </text>
              </g>
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text 
              key={i} 
              x={p.x} 
              y={height - 8} 
              textAnchor="middle" 
              className="text-[10px] font-black fill-slate-400 uppercase tracking-wider"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

/**
 * Category Bar Chart - SVG Bar chart showing product/sales categories
 */
export const CategoryBarChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { label: 'Vegetables', value: 42 },
    { label: 'Meats', value: 28 },
    { label: 'Beverages', value: 15 },
    { label: 'Spices', value: 8 },
    { label: 'Dry Goods', value: 7 }
  ];

  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider mb-1">Categories / Distribution</h4>
      <p className="text-xs text-slate-400 font-bold uppercase mb-6">Volume distribution by category (%)</p>

      <div className="space-y-4">
        {chartData.map((d, i) => {
          const percentage = Math.round((d.value / maxVal) * 100);
          
          // Get specific branding color classes per category
          const getBarColor = (label) => {
            const l = label.toLowerCase();
            if (l.includes('meat') || l.includes('vian')) return 'bg-brand-terracotta';
            if (l.includes('spice') || l.includes('epice')) return 'bg-brand-saffron';
            if (l.includes('bev') || l.includes('boiss')) return 'bg-brand-accent';
            return 'bg-brand-secondary';
          };

          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{d.label}</span>
                <span className="font-black text-brand-primary">{d.value}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(d.label)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Status Donut Chart - Visual representation of order statuses
 */
export const StatusDonutChart = ({ data = {} }) => {
  const { pending = 0, confirmed = 0, delivered = 0 } = data;
  const total = pending + confirmed + delivered;

  const width = 180;
  const height = 180;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentages
  const pPending = total > 0 ? (pending / total) * 100 : 0;
  const pConfirmed = total > 0 ? (confirmed / total) * 100 : 0;
  const pDelivered = total > 0 ? (delivered / total) * 100 : 100;

  // Calculate dash arrays & offsets
  const strokeDelivered = (pDelivered / 100) * circumference;
  const strokeConfirmed = (pConfirmed / 100) * circumference;
  const strokePending = (pPending / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center">
      <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider mb-1 self-start w-full">Order Statuses</h4>
      <p className="text-xs text-slate-400 font-bold uppercase mb-4 self-start">Breakdown of all requests</p>

      {total > 0 ? (
        <div className="flex items-center justify-between w-full mt-2">
          {/* SVG Donut */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg width="100%" height="100%" viewBox="0 0 160 160" className="-rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth="16"
              />
              {/* Delivered (Green) */}
              {pDelivered > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-brand-secondary)"
                  strokeWidth="16"
                  strokeDasharray={`${strokeDelivered} ${circumference}`}
                  strokeDashoffset={0}
                  className="transition-all duration-1000"
                />
              )}
              {/* Confirmed (Blue/Accent) */}
              {pConfirmed > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-brand-accent)"
                  strokeWidth="16"
                  strokeDasharray={`${strokeConfirmed} ${circumference}`}
                  strokeDashoffset={-strokeDelivered}
                  className="transition-all duration-1000"
                />
              )}
              {/* Pending (Yellow/Saffron) */}
              {pPending > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-brand-saffron)"
                  strokeWidth="16"
                  strokeDasharray={`${strokePending} ${circumference}`}
                  strokeDashoffset={-(strokeDelivered + strokeConfirmed)}
                  className="transition-all duration-1000"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-brand-primary">{total}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Orders</span>
            </div>
          </div>

          {/* Legends */}
          <div className="ml-4 space-y-2 text-xs font-bold text-slate-600 flex-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-brand-secondary rounded-full"></span> Delivered</span>
              <span className="font-black text-brand-primary">{delivered}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-brand-accent rounded-full"></span> Confirmed</span>
              <span className="font-black text-brand-primary">{confirmed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-brand-saffron rounded-full"></span> Pending</span>
              <span className="font-black text-brand-primary">{pending}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10 text-xs font-bold text-slate-400">No order status data</div>
      )}
    </div>
  );
};

