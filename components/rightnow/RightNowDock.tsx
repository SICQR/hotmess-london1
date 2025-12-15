'use client';

interface RightNowDockProps {
  onMessBrainOpen: () => void;
}

export function RightNowDock({ onMessBrainOpen }: RightNowDockProps) {
  const pathname = window.location.pathname;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.1)',
        padding: '12px 16px',
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Post Button (Big CTA) */}
        <a
          href="/right-now/new"
          className="flex-shrink-0"
          style={{
            background: '#FF0080',
            color: '#000000',
            padding: '14px 28px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            border: 'none',
            boxShadow: '0 0 20px rgba(255,0,128,0.4)',
          }}
        >
          + POST
        </a>

        {/* Globe */}
        <a
          href="/map"
          className="flex flex-col items-center gap-1 transition-opacity hover:opacity-100"
          style={{
            opacity: pathname === '/map' ? 1 : 0.6,
          }}
        >
          <div style={{ fontSize: '20px' }}>🌍</div>
          <div style={{
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
          }}>
            GLOBE
          </div>
        </a>

        {/* Mess Brain */}
        <button
          onClick={onMessBrainOpen}
          className="flex flex-col items-center gap-1 transition-opacity hover:opacity-100"
          style={{ opacity: 0.6 }}
        >
          <div style={{ fontSize: '20px' }}>🧠</div>
          <div style={{
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
          }}>
            MESS BRAIN
          </div>
        </button>

        {/* Care */}
        <a
          href="/hnh-mess"
          className="flex flex-col items-center gap-1 transition-opacity hover:opacity-100"
          style={{
            opacity: pathname === '/hnh-mess' ? 1 : 0.6,
          }}
        >
          <div style={{ fontSize: '20px' }}>🧴</div>
          <div style={{
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
          }}>
            CARE
          </div>
        </a>
      </div>
    </div>
  );
}
