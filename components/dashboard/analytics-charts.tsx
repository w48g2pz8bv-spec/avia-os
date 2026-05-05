"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const trafficData = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 900 },
  { name: '12:00', value: 1500 },
  { name: '16:00', value: 1200 },
  { name: '20:00', value: 1800 },
  { name: '23:59', value: 1100 },
];

const responseData = [
  { name: 'Mon', rate: 98 },
  { name: 'Tue', rate: 95 },
  { name: 'Wed', rate: 99 },
  { name: 'Thu', rate: 97 },
  { name: 'Fri', rate: 92 },
  { name: 'Sat', rate: 96 },
  { name: 'Sun', rate: 99 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050506]/90 border border-white/10 backdrop-blur-md p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-mono text-white/40 uppercase mb-1">{label}</p>
        <p className="text-sm font-black text-[#00ffd1]">
          {payload[0].value} <span className="text-[10px] text-white/20">Units</span>
        </p>
      </div>
    );
  }
  return null;
};

export function TrafficChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trafficData}>
          <defs>
            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ffd1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00ffd1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'monospace' }}
          />
          <YAxis
            hide
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#00ffd1', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00ffd1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTraffic)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ResponseRateChart() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={responseData}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'monospace' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-black/80 border border-white/10 p-2 rounded-lg">
                    <span className="text-[10px] font-mono text-[#00ffd1]">{payload[0].value}% Success</span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
            {responseData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.rate > 95 ? '#00ffd1' : 'rgba(255,255,255,0.2)'}
                fillOpacity={entry.rate > 95 ? 0.8 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
