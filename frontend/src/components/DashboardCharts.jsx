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
    <div className="bg-brand-surface border border-white/[0.04] p-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white">Revenue Trend</h4>
          <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mt-1">Weekly statistics (MAD)</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-1 border border-brand-primary/20">
          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></span>
          Live Stats
        </div>
      </div>

      <div className="relative w-full h-[220px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity="0.0" />
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
              <g key={i} className="opacity-25">
                <line 
                  x1={paddingX} 
                  y1={y} 
                  x2={width - paddingX} 
                  y2={y} 
                  stroke="rgba(255, 255, 255, 0.1)" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingX - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-[10px] font-bold fill-white/50"
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
              strokeWidth="3" 
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="8" 
                fill="var(--color-brand-accent)" 
                className="opacity-0 group-hover:opacity-10 transition-all duration-300 transform scale-150"
              />
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="4.5" 
                fill="#ffffff" 
                stroke="var(--color-brand-primary)" 
                strokeWidth="2.5" 
                className="transition-all duration-300"
              />
              {/* Tooltip value */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect 
                  x={p.x - 35} 
                  y={p.y - 32} 
                  width="70" 
                  height="22" 
                  fill="#0a0a0a"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
                <text 
                  x={p.x} 
                  y={p.y - 17} 
                  textAnchor="middle" 
                  className="text-[10px] font-bold fill-white"
                >
                  {p.value} DH
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
              className="text-[9px] font-bold fill-white/40 uppercase tracking-widest"
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
    <div className="bg-brand-surface border border-white/[0.04] p-6">
      <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white mb-1">Categories</h4>
      <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-6">Volume distribution (%)</p>

      <div className="space-y-4">
        {chartData.map((d, i) => {
          const percentage = Math.round((d.value / maxVal) * 100);
          
          const getBarColor = (label) => {
            const l = label.toLowerCase();
            if (l.includes('meat') || l.includes('vian')) return 'bg-brand-terracotta';
            if (l.includes('spice') || l.includes('epice')) return 'bg-brand-saffron';
            if (l.includes('bev') || l.includes('boiss')) return 'bg-brand-accent';
            return 'bg-brand-primary';
          };

          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-white/60">
                <span>{d.label}</span>
                <span className="font-bold text-white">{d.value}%</span>
              </div>
              <div className="w-full h-2 bg-white/[0.04] border border-white/[0.02] overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${getBarColor(d.label)}`}
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
    <div className="bg-brand-surface border border-white/[0.04] p-6 flex flex-col items-center">
      <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white mb-1 self-start w-full">Order Statuses</h4>
      <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-6 self-start">Breakdown of requests</p>

      {total > 0 ? (
        <div className="flex flex-col items-center gap-6 w-full mt-2">
          {/* SVG Donut */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg width="100%" height="100%" viewBox="0 0 160 160" className="-rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth="14"
              />
              {/* Delivered */}
              {pDelivered > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-brand-primary)"
                  strokeWidth="14"
                  strokeDasharray={`${strokeDelivered} ${circumference}`}
                  strokeDashoffset={0}
                  className="transition-all duration-1000"
                />
              )}
              {/* Confirmed */}
              {pConfirmed > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-brand-accent)"
                  strokeWidth="14"
                  strokeDasharray={`${strokeConfirmed} ${circumference}`}
                  strokeDashoffset={-strokeDelivered}
                  className="transition-all duration-1000"
                />
              )}
              {/* Pending */}
              {pPending > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-brand-saffron)"
                  strokeWidth="14"
                  strokeDasharray={`${strokePending} ${circumference}`}
                  strokeDashoffset={-(strokeDelivered + strokeConfirmed)}
                  className="transition-all duration-1000"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-lg font-bold text-white">{total}</span>
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Orders</span>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-2 text-[11px] font-semibold text-white/50 w-full pt-4 border-t border-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-brand-primary"></span> Delivered</span>
              <span className="font-bold text-white">{delivered}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-brand-accent"></span> Confirmed</span>
              <span className="font-bold text-white">{confirmed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-brand-saffron"></span> Pending</span>
              <span className="font-bold text-white">{pending}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10 text-[11px] font-semibold text-white/30 uppercase tracking-widest">No order stats</div>
      )}
    </div>
  );
};
