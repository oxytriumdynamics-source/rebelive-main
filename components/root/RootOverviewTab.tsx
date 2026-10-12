'use client';

import React from 'react';
import {
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { AdminDashboardData } from '@/lib/adminApi';

interface RootOverviewTabProps {
  data: AdminDashboardData | null;
  userName?: string;
  onNavigateTab: (tab: 'orders' | 'products' | 'users' | 'shiprocket') => void;
}

export function RootOverviewTab({ data, userName = 'User', onNavigateTab }: RootOverviewTabProps) {
  const stats = data?.stats || {
    totalRevenue: 104280,
    totalOrders: 68,
    totalUsers: 142,
    totalProducts: 4,
    pendingOrders: 3,
    shippedOrders: 42,
    deliveredOrders: 21,
    shiprocketSyncedOrders: 63,
  };

  // Activity Overview Chart Coordinates (SVG viewBox 0 0 700 200)
  const chartPoints = [
    { day: 'Mon', value: 30, x: 50, y: 135 },
    { day: 'Tue', value: 45, x: 150, y: 105 },
    { day: 'Wed', value: 38, x: 250, y: 120 },
    { day: 'Thu', value: 60, x: 350, y: 75 },
    { day: 'Fri', value: 72, x: 450, y: 48 },
    { day: 'Sat', value: 50, x: 550, y: 95 },
    { day: 'Sun', value: 65, x: 650, y: 65 },
  ];

  const svgPathD = chartPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const svgAreaD = `${svgPathD} L ${chartPoints[chartPoints.length - 1].x} 180 L ${chartPoints[0].x} 180 Z`;

  // Recent tasks matching the user's reference mockup
  const recentTasks = [
    { task: 'Update dashboard UI', project: 'Workspace App', dueDate: '12 Aug', status: 'Completed' },
    { task: 'Fix login issue', project: 'Auth System', dueDate: '11 Aug', status: 'In Progress' },
    { task: 'Design new icons', project: 'UI Kit', dueDate: '10 Aug', status: 'Pending' },
    { task: 'Client feedback review', project: 'Project A', dueDate: '09 Aug', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* ─── 1. Welcome Section ─── */}
      <div className="space-y-1">
        <p className="text-xs text-white/40 font-mono tracking-wider">
          Welcome section
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Nice to see you again, {userName}
        </h2>
        <p className="text-xs sm:text-sm text-white/50">
          Here's your workspace overview
        </p>
      </div>

      {/* ─── 2. Four Stat Cards in a row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tasks Completed */}
        <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-2">
          <p className="text-xs text-white/60 font-medium">
            Tasks Completed
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            128
          </div>
          <p className="text-[11px] text-white/50 font-sans">
            +12% this week
          </p>
        </div>

        {/* Card 2: Active Projects */}
        <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-2">
          <p className="text-xs text-white/60 font-medium">
            Active Projects
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            12
          </div>
          <p className="text-[11px] text-white/50 font-sans">
            2 due today
          </p>
        </div>

        {/* Card 3: Messages */}
        <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-2">
          <p className="text-xs text-white/60 font-medium">
            Messages
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            34
          </div>
          <p className="text-[11px] text-white/50 font-sans">
            5 unread
          </p>
        </div>

        {/* Card 4: Productivity */}
        <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-2">
          <p className="text-xs text-white/60 font-medium">
            Productivity
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            82%
          </div>
          <p className="text-[11px] text-white/50 font-sans">
            +5% improvement
          </p>
        </div>
      </div>

      {/* ─── 3. Activity Overview Card (Line Chart) ─── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Activity Overview
        </h3>

        <div className="w-full overflow-x-auto [scrollbar-width:none]">
          <div className="min-w-[600px] relative">
            <svg
              viewBox="0 0 700 200"
              className="w-full h-48 overflow-visible"
            >
              <defs>
                <linearGradient id="monoChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="30" y1="50" x2="670" y2="50" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="670" y2="100" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
              <line x1="30" y1="150" x2="670" y2="150" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />

              {/* Area fill */}
              <path d={svgAreaD} fill="url(#monoChartGrad)" />

              {/* Main Line */}
              <path
                d={svgPathD}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & Value tags */}
              {chartPoints.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#0d0d0d"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="sans-serif"
                    opacity="0.8"
                  >
                    {pt.day} : {pt.value}
                  </text>
                  <text
                    x={pt.x}
                    y={185}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="sans-serif"
                    opacity="0.4"
                  >
                    {pt.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* ─── 4. Recent Tasks Table Card ─── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Recent Tasks
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-[11px]">
                <th className="pb-3 font-semibold">Task</th>
                <th className="pb-3 font-semibold">Project</th>
                <th className="pb-3 font-semibold">Due Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentTasks.map((t, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pr-4 text-white font-medium">
                    {t.task}
                  </td>
                  <td className="py-3.5 pr-4 text-white/70">
                    {t.project}
                  </td>
                  <td className="py-3.5 pr-4 text-white/50">
                    {t.dueDate}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          t.status === 'Completed'
                            ? 'bg-white'
                            : t.status === 'In Progress'
                            ? 'bg-white/60'
                            : 'bg-white/30'
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          t.status === 'Completed'
                            ? 'text-white'
                            : t.status === 'In Progress'
                            ? 'text-white/80'
                            : 'text-white/50'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 5. Store Operations Status (Monochrome) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        {/* Logistics Status */}
        <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-white" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Logistics Hub
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab('shiprocket')}
              className="text-xs font-mono text-white/60 hover:text-white hover:underline cursor-pointer"
            >
              View Hub →
            </button>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white">Shiprocket Dispatch Engine</p>
              <p className="text-[10px] text-white/40 font-mono">Amritsar Hub (143001) · Live Sync</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white text-black">
              CONNECTED
            </span>
          </div>
        </div>

        {/* Inventory Reserves */}
        <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-white" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Inventory Reserves
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-mono text-white/60 hover:text-white hover:underline cursor-pointer"
            >
              Manage Catalog →
            </button>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white">Product Variants Status</p>
              <p className="text-[10px] text-white/40 font-mono">
                {stats.totalProducts} Core SKUs Active
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-white/10 text-white border border-white/20">
              HEALTHY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
