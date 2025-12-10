import React from "react";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  const demoBeacons = [
    {
      code: "DEMO_CHECKIN",
      label: "Soho Sauna Check-in",
      type: "presence",
      subtype: "checkin",
      description: "Venue check-in with geo validation",
      xp: "25 XP (inside venue)"
    },
    {
      code: "DEMO_TICKET",
      label: "Launch Party Ticket",
      type: "transaction",
      subtype: "ticket",
      description: "Event ticket with door scan mode",
      xp: "10 XP (on validation)"
    },
    {
      code: "DEMO_PRODUCT",
      label: "RAW Vest Drop",
      type: "transaction",
      subtype: "product",
      description: "Product listing with purchase flow",
      xp: "5 XP (on purchase)"
    },
    {
      code: "DEMO_PERSON",
      label: "Hook-up QR",
      type: "social",
      subtype: "person",
      description: "Personal QR for connections",
      xp: "1 XP (on request)"
    },
    {
      code: "DEMO_ROOM",
      label: "Chat Room",
      type: "social",
      subtype: "room",
      description: "Static room invite",
      xp: "1 XP (on join)"
    },
    {
      code: "DEMO_HNH",
      label: "Hand N Hand",
      type: "care",
      subtype: "hnh",
      description: "Aftercare and resources",
      xp: "1 XP (symbolic)"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🔥 HOTMESS BEACON OS</h1>
            <p className="text-sm text-neutral-400 uppercase tracking-wider">
              Demo Backend • 6 Beacon Types
            </p>
          </div>
        </div>
      </div>

      {/* Demo Beacons Grid */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Demo Beacons</h2>
          <p className="text-sm text-neutral-400">
            Click any beacon to see the scan flow. Backend running on{" "}
            <code className="bg-neutral-900 px-1 py-0.5 rounded text-xs">
              localhost:3001
            </code>
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {demoBeacons.map((beacon) => (
            <Link
              key={beacon.code}
              to={`/l/${beacon.code}`}
              className="block border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition bg-neutral-950/50 backdrop-blur"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 mb-1">
                    {beacon.type} / {beacon.subtype}
                  </p>
                  <h3 className="text-lg font-semibold">{beacon.label}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-lime-400">
                    {beacon.xp}
                  </p>
                </div>
              </div>
              <p className="text-sm text-neutral-400 mb-3">
                {beacon.description}
              </p>
              <div className="flex items-center justify-between">
                <code className="text-[10px] bg-neutral-900 px-2 py-1 rounded">
                  {beacon.code}
                </code>
                <span className="text-xs text-neutral-500">
                  Tap to scan →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Special Test Links */}
        <div className="mt-12 border-t border-neutral-800 pt-8">
          <h2 className="text-xl font-semibold mb-4">Special Tests</h2>
          
          <div className="space-y-3">
            <Link
              to="/l/DEMO_CHECKIN?lat=51.5136&lng=-0.1357"
              className="block border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition bg-neutral-950/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold mb-1">
                    Check-in (Inside Venue)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Simulates geo location inside venue radius (25 XP)
                  </p>
                </div>
                <span className="text-xs text-neutral-500">→</span>
              </div>
            </Link>

            <Link
              to="/l/DEMO_TICKET?mode=validate"
              className="block border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition bg-neutral-950/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold mb-1">
                    Ticket Door Scan
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Validates ticket and marks as scanned (10 XP)
                  </p>
                </div>
                <span className="text-xs text-neutral-500">→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* API Info */}
        <div className="mt-12 border border-neutral-800 rounded-xl p-6 bg-neutral-950/30">
          <h2 className="text-sm font-semibold mb-3">API Endpoints</h2>
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-neutral-500">Standard:</span>{" "}
              <code className="text-lime-400">GET /l/:code</code>
            </div>
            <div>
              <span className="text-neutral-500">Signed:</span>{" "}
              <code className="text-lime-400">GET /x/:payload.:sig</code>
            </div>
            <div>
              <span className="text-neutral-500">Health:</span>{" "}
              <code className="text-lime-400">GET /health</code>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <p className="text-xs text-neutral-500 mb-2">
              Backend must be running on port 3001:
            </p>
            <code className="text-[10px] text-neutral-400 block bg-black p-2 rounded">
              cd beacon-backend && npm install && npm run dev
            </code>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500 mb-2">
            Full Documentation:
          </p>
          <div className="flex items-center justify-center gap-3 text-xs">
            <a
              href="/docs/BEACONS.md"
              className="text-neutral-400 hover:text-white transition"
            >
              Spec
            </a>
            <span className="text-neutral-700">•</span>
            <a
              href="/docs/API_BEACONS.md"
              className="text-neutral-400 hover:text-white transition"
            >
              API
            </a>
            <span className="text-neutral-700">•</span>
            <a
              href="/docs/BEACON_OS_QUICK_START.md"
              className="text-neutral-400 hover:text-white transition"
            >
              Quick Start
            </a>
            <span className="text-neutral-700">•</span>
            <a
              href="/beacon-backend/README.md"
              className="text-neutral-400 hover:text-white transition"
            >
              Backend
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-neutral-500">
            Built with care for the queer nightlife community 🖤💗
          </p>
        </div>
      </div>
    </div>
  );
};
