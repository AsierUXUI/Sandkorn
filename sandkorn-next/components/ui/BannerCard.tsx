import type { Banner } from '@/lib/data/banners'

export function BannerCard({ banner }: { banner: Banner }) {
  const linkProps = banner.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  if (banner.variant === 'eu') {
    return (
      <a
        href={banner.href}
        {...linkProps}
        className="block no-underline rounded-[14px] overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg,#003399 0%,#1a4fa8 100%)' }}
      >
        <div className="absolute right-[-18px] top-[-18px] w-[100px] h-[100px] rounded-full bg-white/4 pointer-events-none" />
        <div className="p-4 flex items-start gap-3 relative">
          <div className="flex-shrink-0 mt-0.5 bg-white/12 rounded-lg p-1.5">
            <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50.00,2.00 52.47,8.60 59.51,8.91 53.99,13.30 55.88,20.09 50.00,16.20 44.12,20.09 46.01,13.30 40.49,8.91 47.53,8.60" fill="#FFCC00"/>
              <polygon points="69.00,7.09 71.47,13.69 78.51,14.00 72.99,18.39 74.88,25.18 69.00,21.29 63.12,25.18 65.01,18.39 59.49,14.00 66.53,13.69" fill="#FFCC00"/>
              <polygon points="82.91,21.00 85.38,27.60 92.42,27.91 86.90,32.30 88.79,39.09 82.91,35.20 77.03,39.09 78.91,32.30 73.40,27.91 80.44,27.60" fill="#FFCC00"/>
              <polygon points="88.00,40.00 90.47,46.60 97.51,46.91 91.99,51.30 93.88,58.09 88.00,54.20 82.12,58.09 84.01,51.30 78.49,46.91 85.53,46.60" fill="#FFCC00"/>
              <polygon points="82.91,59.00 85.38,65.60 92.42,65.91 86.90,70.30 88.79,77.09 82.91,73.20 77.03,77.09 78.91,70.30 73.40,65.91 80.44,65.60" fill="#FFCC00"/>
              <polygon points="69.00,72.91 71.47,79.51 78.51,79.82 72.99,84.21 74.88,91.00 69.00,87.11 63.12,91.00 65.01,84.21 59.49,79.82 66.53,79.51" fill="#FFCC00"/>
              <polygon points="50.00,78.00 52.47,84.60 59.51,84.91 53.99,89.30 55.88,96.09 50.00,92.20 44.12,96.09 46.01,89.30 40.49,84.91 47.53,84.60" fill="#FFCC00"/>
              <polygon points="31.00,72.91 33.47,79.51 40.51,79.82 34.99,84.21 36.88,91.00 31.00,87.11 25.12,91.00 27.01,84.21 21.49,79.82 28.53,79.51" fill="#FFCC00"/>
              <polygon points="17.09,59.00 19.56,65.60 26.60,65.91 21.09,70.30 22.97,77.09 17.09,73.20 11.21,77.09 13.10,70.30 7.58,65.91 14.62,65.60" fill="#FFCC00"/>
              <polygon points="12.00,40.00 14.47,46.60 21.51,46.91 15.99,51.30 17.88,58.09 12.00,54.20 6.12,58.09 8.01,51.30 2.49,46.91 9.53,46.60" fill="#FFCC00"/>
              <polygon points="17.09,21.00 19.56,27.60 26.60,27.91 21.09,32.30 22.97,39.09 17.09,35.20 11.21,39.09 13.10,32.30 7.58,27.91 14.62,27.60" fill="#FFCC00"/>
              <polygon points="31.00,7.09 33.47,13.69 40.51,14.00 34.99,18.39 36.88,25.18 31.00,21.29 25.12,25.18 27.01,18.39 21.49,14.00 28.53,13.69" fill="#FFCC00"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-mono text-[9px] text-white/45 tracking-[.7px] mb-1">{banner.label}</p>
            <p className="font-syne font-bold text-[13px] text-white leading-snug mb-1.5">{banner.title}</p>
            <p className="text-[11px] text-white/65 leading-relaxed mb-2.5">{banner.description}</p>
            <span className="inline-flex items-center gap-1 bg-white/15 border border-white/20 rounded-full px-3 py-1 font-mono text-[9px] text-white tracking-[.3px]">
              {banner.cta}
            </span>
          </div>
        </div>
      </a>
    )
  }

  return (
    <a
      href={banner.href}
      {...linkProps}
      className="block no-underline rounded-[14px] overflow-hidden"
      style={{ background: 'linear-gradient(135deg,rgba(20,10,50,.92) 0%,rgba(40,20,90,.82) 100%)' }}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 bg-white/10 rounded-lg p-1.5">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="9" cy="8.5" r="3.5" fill="rgba(255,255,255,.9)"/>
            <path d="M3 22c0-3.3 2.7-6 6-6h0c3.3 0 6 2.7 6 6" stroke="rgba(255,255,255,.9)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="21" cy="8.5" r="3" fill="rgba(255,255,255,.5)"/>
            <path d="M15.5 22c0-3 2.5-5.5 5.5-5.5h0c3 0 5.5 2.5 5.5 5.5" stroke="rgba(255,255,255,.5)" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M12 27.5 L20 27.5 M17 25 L20 27.5 L17 30" stroke="rgba(38,210,166,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-mono text-[9px] text-white/45 tracking-[.7px] mb-1">{banner.label}</p>
          <p className="font-caveat font-bold text-[22px] text-white leading-tight mb-1">{banner.title}</p>
          {banner.subtitle && (
            <p className="text-[10px] text-white/60 mb-1.5">{banner.subtitle}</p>
          )}
          <p className="text-[11px] text-white/65 leading-relaxed mb-2.5">{banner.description}</p>
          <span className="inline-flex items-center gap-1 bg-white/12 border border-white/18 rounded-full px-3 py-1 font-mono text-[9px] text-white tracking-[.3px]">
            {banner.cta}
          </span>
        </div>
      </div>
    </a>
  )
}
