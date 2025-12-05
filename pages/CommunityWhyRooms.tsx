// Why Rooms? - Educational page explaining the Telegram ecosystem

import { Users, Shield, Zap, MessageCircle, Calendar, Heart, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrutalistCard } from "@/components/layouts/BrutalistCard";
import { typography, spacing } from "@/lib/design-system";

interface CommunityWhyRoomsProps {
  onNavigate: (route: string) => void;
}

const ROOMS_BOT = "https://t.me/HotmessRoomsBot?start=london";

export default function CommunityWhyRooms({ onNavigate }: CommunityWhyRoomsProps) {
  return (
    <main className={spacing.pageContainer + " " + spacing.sectionVertical}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className={typography.h1 + " text-hot"}>Why Rooms?</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          HOTMESS runs on city rooms — private spaces for men in the same city to move as one.
        </p>
      </div>

      {/* What You Get */}
      <section className="space-y-6">
        <h2 className={typography.h2}>What you get:</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "Real men in real places", icon: Users },
            { label: "Event intel", icon: Calendar },
            { label: "Host updates", icon: MessageCircle },
            { label: "Drops", icon: TrendingUp },
            { label: "Aftercare", icon: Heart },
            { label: "City rituals", icon: Zap },
            { label: "Club announcements", icon: MessageCircle },
            { label: "XP challenges", icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-5 flex items-center gap-4"
              >
                <Icon className="h-6 w-6 text-hot flex-shrink-0" />
                <div className="font-bold">{item.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Telegram */}
      <BrutalistCard variant="section">
        <div className="space-y-6">
          <h2 className={typography.h2}>Why Telegram?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Shield className="h-8 w-8 text-hot" />
              <h3 className={typography.h3}>Encrypted</h3>
              <p className="text-sm opacity-70">
                End-to-end encryption. Your conversations stay private.
              </p>
            </div>
            <div className="space-y-3">
              <Zap className="h-8 w-8 text-hot" />
              <h3 className={typography.h3}>Fast</h3>
              <p className="text-sm opacity-70">
                Real-time updates. No lag. Instant notifications.
              </p>
            </div>
            <div className="space-y-3">
              <Users className="h-8 w-8 text-hot" />
              <h3 className={typography.h3}>No algorithms</h3>
              <p className="text-sm opacity-70">
                No feed sorting. No ads. No noise. Just people.
              </p>
            </div>
          </div>
          <div className="pt-4 space-y-3">
            <div className="font-bold">Additional benefits:</div>
            <ul className="text-sm opacity-70 space-y-2 list-disc list-inside">
              <li>Exceptional group tools (polls, files, threads)</li>
              <li>Global scalability (works everywhere)</li>
              <li>No phone number required for joining</li>
              <li>Desktop + mobile apps</li>
            </ul>
          </div>
        </div>
      </BrutalistCard>

      {/* What HOTMESS Adds */}
      <section className="space-y-6">
        <h2 className={typography.h2}>What HOTMESS adds:</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <BrutalistCard>
            <div className="space-y-3">
              <Zap className="h-6 w-6 text-hot" />
              <h3 className={typography.h3}>XP System</h3>
              <p className="text-sm opacity-70">
                Earn points for participation. Level up. Unlock perks and new rooms.
              </p>
            </div>
          </BrutalistCard>
          <BrutalistCard>
            <div className="space-y-3">
              <Calendar className="h-6 w-6 text-hot" />
              <h3 className={typography.h3}>Event Rooms</h3>
              <p className="text-sm opacity-70">
                Dedicated rooms for each major event. Talk to men attending. Get set times.
              </p>
            </div>
          </BrutalistCard>
          <BrutalistCard>
            <div className="space-y-3">
              <Heart className="h-6 w-6 text-hot" />
              <h3 className={typography.h3}>Care Check-ins</h3>
              <p className="text-sm opacity-70">
                Private aftercare support. Crisis resources. Zero judgement.
              </p>
            </div>
          </BrutalistCard>
          <BrutalistCard>
            <div className="space-y-3">
              <TrendingUp className="h-6 w-6 text-hot" />
              <h3 className={typography.h3}>Drop Alerts</h3>
              <p className="text-sm opacity-70">
                Early access to limited releases. Seller updates. Market intel.
              </p>
            </div>
          </BrutalistCard>
          <BrutalistCard>
            <div className="space-y-3">
              <Users className="h-6 w-6 text-hot" />
              <h3 className={typography.h3}>Beacon Routing</h3>
              <p className="text-sm opacity-70">
                Scan QR codes. Join event rooms instantly. Track hotspots.
              </p>
            </div>
          </BrutalistCard>
          <BrutalistCard>
            <div className="space-y-3">
              <Shield className="h-6 w-6 text-hot" />
              <h3 className={typography.h3}>Moderation</h3>
              <p className="text-sm opacity-70">
                Active host teams. Safety protocols. Zero tolerance for harassment.
              </p>
            </div>
          </BrutalistCard>
        </div>
      </section>

      {/* How to Join */}
      <BrutalistCard variant="section">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <h2 className={typography.h2}>How to join:</h2>
          <div className="space-y-4 text-left">
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-hot w-8 flex-shrink-0">1</div>
              <div>
                <div className="font-bold mb-1">Tap "Enter Rooms"</div>
                <div className="text-sm opacity-70">Opens Telegram with HOTMESS bot</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-hot w-8 flex-shrink-0">2</div>
              <div>
                <div className="font-bold mb-1">Join 3–5 rooms</div>
                <div className="text-sm opacity-70">Start with General, Events, and one interest room</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-hot w-8 flex-shrink-0">3</div>
              <div>
                <div className="font-bold mb-1">Earn XP</div>
                <div className="text-sm opacity-70">Participate, scan beacons, attend events</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-hot w-8 flex-shrink-0">4</div>
              <div>
                <div className="font-bold mb-1">Level up</div>
                <div className="text-sm opacity-70">Unlock new rooms, perks, and status</div>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <a
              href={ROOMS_BOT}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-8 py-4 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all inline-flex items-center gap-2"
            >
              <Users className="h-5 w-5" />
              Enter Rooms
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </BrutalistCard>

      {/* Philosophy */}
      <section className="space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className={typography.h2}>Men-first. Simple. Effective.</h2>
          <p className="text-sm opacity-70 leading-relaxed">
            The system is massive, but the UX is simple. You don't see bots, workflows, or admin functions. 
            You just see men, events, and opportunities. The tech stays invisible. The connection stays real.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate("/?route=community")}
              className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
            >
              Back to Community <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
