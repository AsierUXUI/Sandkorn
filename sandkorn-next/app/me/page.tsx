'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'

export default function MePage() {
  const [lang, setLang] = useState<'DA' | 'EN'>('DA')

  return (
    <div className="min-h-screen flex flex-col max-w-[430px] md:max-w-[860px] mx-auto pb-24">
      <TopBar title="Profile" />

      <div className="px-5 pt-6">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-[60px] h-[60px] rounded-full bg-teal-bg border border-teal-border flex items-center justify-center flex-shrink-0">
            <span className="text-[26px]">🌾</span>
          </div>
          <div>
            <p className="font-syne font-extrabold text-[18px] leading-tight">Anonymous</p>
            <p className="font-mono text-[10px] text-dim tracking-[.3px] mt-0.5">Copenhagen · since Mar 2025</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-border rounded-2xl px-4 py-3 text-center">
            <p className="font-syne font-extrabold text-[22px] text-teal leading-none mb-1">2</p>
            <p className="font-mono text-[9px] text-dim tracking-[.3px]">grains</p>
          </div>
          <div className="bg-white border border-border rounded-2xl px-4 py-3 text-center">
            <p className="font-syne font-extrabold text-[22px] leading-none mb-1">8</p>
            <p className="font-mono text-[9px] text-dim tracking-[.3px]">found</p>
          </div>
          <div className="bg-white border border-border rounded-2xl px-4 py-3 text-center">
            <p className="font-syne font-extrabold text-[22px] text-teal leading-none mb-1">€94</p>
            <p className="font-mono text-[9px] text-dim tracking-[.3px]">impact/yr</p>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden mb-4">
          {/* Badges */}
          <Link href="/me/badges" className="flex items-center justify-between px-4 py-3.5 border-b border-border no-underline hover:bg-bg transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-[18px]">🏅</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">Badges</p>
                <p className="font-mono text-[10px] text-dim mt-px">Your boycott achievements</p>
              </div>
            </div>
            <span className="text-dim text-[20px] leading-none">›</span>
          </Link>

          {/* About */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border hover:bg-bg transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-[18px]">📖</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">About Sandkorn</p>
                <p className="font-mono text-[10px] text-dim mt-px">Why, finances, roadmap</p>
              </div>
            </div>
            <span className="text-dim text-[20px] leading-none">›</span>
          </div>

          {/* Invite */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border hover:bg-bg transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-[18px]">🤝</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">Invite people</p>
                <p className="font-mono text-[10px] text-dim mt-px">Leave together</p>
              </div>
            </div>
            <span className="text-dim text-[20px] leading-none">›</span>
          </div>

          {/* Settings */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border hover:bg-bg transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-[18px]">⚙️</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">Settings</p>
                <p className="font-mono text-[10px] text-dim mt-px">Notifications, privacy, data</p>
              </div>
            </div>
            <span className="text-dim text-[20px] leading-none">›</span>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-[18px]">🌐</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">Language</p>
                <p className="font-mono text-[10px] text-dim mt-px">App language</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {(['DA', 'EN'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-lg border tracking-[.3px] transition-colors ${
                    lang === l
                      ? 'bg-teal text-white border-teal'
                      : 'text-dim border-border bg-bg'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/AsierUXUI/Sandkorn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3.5 no-underline hover:bg-bg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[18px]">💻</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">GitHub</p>
                <p className="font-mono text-[10px] text-dim mt-px">Open source</p>
              </div>
            </div>
            <span className="text-dim text-[20px] leading-none">›</span>
          </a>
        </div>

        {/* Donate CTA */}
        <button className="w-full bg-sand text-white rounded-2xl py-4 font-syne font-extrabold text-[15px] tracking-[.3px] mb-6">
          Donate to keep this going
        </button>
      </div>
    </div>
  )
}
