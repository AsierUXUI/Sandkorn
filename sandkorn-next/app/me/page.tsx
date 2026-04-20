import { TopBar } from '@/components/layout/TopBar'

export default function MePage() {
  return (
    <div className="min-h-screen flex flex-col max-w-[430px] md:max-w-[860px] mx-auto pb-16">
      <TopBar title="Me" />

      <div className="flex-1 px-5 pt-6">
        {/* Profile stub */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-teal-bg border border-teal-border flex items-center justify-center">
            <span className="font-syne font-extrabold text-[20px] text-teal-2">?</span>
          </div>
          <div>
            <p className="font-syne font-extrabold text-[17px]">Anonymous</p>
            <p className="font-mono text-[10px] text-dim tracking-[.4px]">LOGIN COMING SOON</p>
          </div>
        </div>

        {/* Badges section */}
        <p className="font-mono text-[10px] text-dim tracking-[1px] mb-3">BADGES</p>
        <div className="bg-white border border-border rounded-2xl p-8 text-center">
          <p className="font-syne font-bold text-[15px] mb-2">No badges yet</p>
          <p className="text-[13px] text-mid leading-relaxed">
            Complete a full boycott to earn your first badge. Finish all steps before the month ends.
          </p>
        </div>

        <p className="font-mono text-[9px] text-dim text-center tracking-[.5px] mt-10">
          PROFILE · AUTH · BADGES — PHASE 4
        </p>
      </div>
    </div>
  )
}
