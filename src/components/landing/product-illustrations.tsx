export function LedgerIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 72"
      width="100%"
      height="100%"
      fill="none"
      className={className}
      aria-label="Ledger Hardware Wallet illustration"
    >
      <defs>
        <linearGradient id="ledgerBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e2432" />
          <stop offset="100%" stopColor="#0d111a" />
        </linearGradient>
        <linearGradient id="ledgerSteel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="ledgerScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      {/* Main black body */}
      <rect x="18" y="22" width="76" height="28" rx="6" fill="url(#ledgerBody)" stroke="#334155" strokeWidth="1" />
      
      {/* Screen */}
      <rect x="26" y="27" width="34" height="18" rx="3" fill="url(#ledgerScreen)" stroke="#1e293b" strokeWidth="0.8" />
      
      {/* Screen glowing text lines (cryptographic address representation) */}
      <rect x="30" y="32" width="22" height="2" rx="1" fill="#7048cf" opacity="0.9" />
      <rect x="30" y="37" width="16" height="2" rx="1" fill="#a855f7" opacity="0.8" />
      <circle cx="54" cy="36" r="2" fill="#10b981" />

      {/* Right button & port */}
      <circle cx="78" cy="36" r="4.5" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
      <rect x="86" y="34" width="4" height="4" rx="1" fill="#475569" />

      {/* Swivel brushed steel cover (open at angle) */}
      <path
        d="M 28 14 L 102 24 C 104 24.3 105 26 104.5 28 L 98 48 C 97.6 49.5 96 50.2 94.5 49.8 L 22 40 Z"
        fill="url(#ledgerSteel)"
        opacity="0.92"
        stroke="#64748b"
        strokeWidth="0.8"
      />
      {/* Pivot rivet */}
      <circle cx="30" cy="27" r="4" fill="#64748b" stroke="#e2e8f0" strokeWidth="1.2" />
      <circle cx="30" cy="27" r="1.5" fill="#334155" />
    </svg>
  )
}

export function TerminalIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 72"
      width="100%"
      height="100%"
      fill="none"
      className={className}
      aria-label="Smart POS Terminal Stand illustration"
    >
      <defs>
        <linearGradient id="terminalBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="terminalScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#18122c" />
          <stop offset="100%" stopColor="#0c0718" />
        </linearGradient>
        <linearGradient id="nfcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7048cf" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Stand base plate */}
      <ellipse cx="60" cy="58" rx="38" ry="7" fill="url(#terminalBase)" stroke="#cbd5e1" strokeWidth="1" />
      <ellipse cx="60" cy="58" rx="20" ry="3.5" fill="#94a3b8" opacity="0.4" />

      {/* Terminal stand neck */}
      <path d="M 54 44 L 56 56 L 64 56 L 66 44 Z" fill="#94a3b8" />

      {/* Angled Terminal tablet body */}
      <rect x="36" y="10" width="48" height="38" rx="6" fill="url(#terminalScreen)" stroke="#7048cf" strokeWidth="1.2" />
      
      {/* Screen bezel & content */}
      <rect x="40" y="14" width="40" height="30" rx="3" fill="#120c22" />
      
      {/* WhitePe Diamond mark on terminal screen */}
      <path d="M 60 19 L 66 25 L 60 31 L 54 25 Z" fill="#7048cf" opacity="0.9" />
      <path d="M 57 26 L 60 23 L 63 26" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Screen Amount Pill */}
      <rect x="46" y="35" width="28" height="4" rx="2" fill="url(#nfcGlow)" />

      {/* Contactless waves above terminal */}
      <path d="M 52 6 C 56 4 64 4 68 6" stroke="#7048cf" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <path d="M 47 3 C 54 0 66 0 73 3" stroke="#a855f7" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export function SmartCardIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 72"
      width="100%"
      height="100%"
      fill="none"
      className={className}
      aria-label="Contactless Crypto Card Reader illustration"
    >
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#281a49" />
          <stop offset="50%" stopColor="#19112e" />
          <stop offset="100%" stopColor="#0f091f" />
        </linearGradient>
        <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      {/* Card body with shadow */}
      <rect
        x="24"
        y="14"
        width="72"
        height="44"
        rx="6"
        fill="url(#cardGrad)"
        stroke="#4c2c8f"
        strokeWidth="1.2"
      />

      {/* Card accent swirl */}
      <path
        d="M 24 38 Q 60 22 96 36 L 96 52 C 96 55 93 58 90 58 L 30 58 C 27 58 24 55 24 52 Z"
        fill="#7048cf"
        opacity="0.18"
      />

      {/* EMV Microchip */}
      <rect x="34" y="24" width="12" height="9" rx="2" fill="url(#chipGrad)" stroke="#a16207" strokeWidth="0.6" />
      <line x1="34" y1="28.5" x2="46" y2="28.5" stroke="#854d0e" strokeWidth="0.6" />
      <line x1="40" y1="24" x2="40" y2="33" stroke="#854d0e" strokeWidth="0.6" />

      {/* Contactless symbol on card */}
      <path d="M 52 25 A 5 5 0 0 1 52 32" stroke="#e2e8f0" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M 54.5 23.5 A 8 8 0 0 1 54.5 33.5" stroke="#e2e8f0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M 57 22 A 11 11 0 0 1 57 35" stroke="#e2e8f0" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

      {/* Card brand mark / chip */}
      <circle cx="82" cy="46" r="5" fill="#f59e0b" opacity="0.85" />
      <circle cx="88" cy="46" r="5" fill="#ef4444" opacity="0.75" />

      {/* Card numbers dot pattern */}
      <rect x="34" y="44" width="24" height="2" rx="1" fill="#94a3b8" opacity="0.5" />
    </svg>
  )
}

export function ShieldSvg({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px`, flexShrink: 0 }}
    >
      <path
        d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"
        fill="#f0eaf8"
        stroke="#7048cf"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="#7048cf"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HackathonSparkleSvg({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px`, flexShrink: 0 }}
    >
      <path
        d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"
        fill="#7048cf"
      />
      <path
        d="M19 16L20.2 19L23 20.2L20.2 21.4L19 24L17.8 21.4L15 20.2L17.8 19L19 16Z"
        fill="#f59e0b"
      />
    </svg>
  )
}

export function Web3WalletSvg({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px`, flexShrink: 0 }}
    >
      <path
        d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"
        stroke="#e17726"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 11h6v6h-6a3 3 0 0 1 0-6Z"
        fill="#fff7ed"
        stroke="#e17726"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18.5" cy="14" r="1.2" fill="#e17726" />
    </svg>
  )
}

