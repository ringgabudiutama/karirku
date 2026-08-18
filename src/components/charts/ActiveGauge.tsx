"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

export default function ActiveGauge({ percent, label }: { percent: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const data = [{ name: "aktif", value: clamped, fill: "#2563EB" }];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-40 w-40">
        <RadialBarChart
          width={160}
          height={160}
          cx={80}
          cy={80}
          innerRadius={58}
          outerRadius={74}
          barSize={12}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: "#EEF1F6" }} dataKey="value" cornerRadius={8} angleAxisId={0} />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-extrabold text-navy-900">{clamped}%</span>
        </div>
      </div>
      <p className="mt-2 text-center text-xs font-medium text-ink-500">{label}</p>
    </div>
  );
}
