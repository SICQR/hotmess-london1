// components/records/SoundCloudPreviewPlayer.tsx
// SoundCloud widget embed with analytics tracking via Widget API

"use client";

import * as React from "react";

declare global {
  interface Window {
    SC: any;
  }
}

interface SoundCloudPreviewPlayerProps {
  widgetUrl: string;
  onEvent?: (e: { type: string; progress_ms?: number }) => void;
}

export function SoundCloudPreviewPlayer({
  widgetUrl,
  onEvent,
}: SoundCloudPreviewPlayerProps) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  React.useEffect(() => {
    // Load SoundCloud Widget API
    const ensureAPI = () =>
      new Promise<void>((resolve) => {
        if (window.SC?.Widget) return resolve();
        const script = document.createElement("script");
        script.src = "https://w.soundcloud.com/player/api.js";
        script.onload = () => resolve();
        document.head.appendChild(script);
      });

    let widget: any;

    (async () => {
      await ensureAPI();
      if (!iframeRef.current) return;
      
      widget = window.SC.Widget(iframeRef.current);

      const E = window.SC.Widget.Events;
      
      widget.bind(E.PLAY, () => onEvent?.({ type: "play" }));
      widget.bind(E.PAUSE, () => onEvent?.({ type: "pause" }));
      widget.bind(E.FINISH, () => onEvent?.({ type: "finish" }));
      widget.bind(E.PLAY_PROGRESS, (data: any) => 
        onEvent?.({ 
          type: "progress", 
          progress_ms: Math.floor(data?.currentPosition ?? 0) 
        })
      );
    })();

    return () => {
      try {
        widget?.unbind?.();
      } catch {}
    };
  }, [widgetUrl, onEvent]);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/20">
      <iframe
        ref={iframeRef}
        title="SoundCloud Preview"
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="0"
        allow="autoplay"
        src={widgetUrl}
      />
    </div>
  );
}
