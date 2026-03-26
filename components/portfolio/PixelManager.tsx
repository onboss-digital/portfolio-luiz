"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import React, { useEffect } from "react";

interface Pixel {
  id: string;
  provider: string;
  pixelId: string;
  status: boolean;
  events?: string | null;
  targetType: string;
  targetUrls?: string | null;
}

export default function PixelManager({ pixels }: { pixels: Pixel[] }) {
  const pathname = usePathname();

  const activePixels = pixels.filter(p => {
    if (!p.status) return false;
    
    if (p.targetType === "all") return true;
    
    const urls = (p.targetUrls || "").split(",").map(u => u.trim());
    const isMatched = urls.some(u => pathname.startsWith(u));

    if (p.targetType === "include") return isMatched;
    if (p.targetType === "exclude") return !isMatched;
    
    return true;
  });

  return (
    <>
      {activePixels.map(p => {
        switch (p.provider) {
          case "facebook":
            return (
              <React.Fragment key={p.id}>
                <Script
                  id={`fb-pixel-${p.id}`}
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      !function(f,b,e,v,n,t,s)
                      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                      n.queue=[];t=b.createElement(e);t.async=!0;
                      t.src=v;s=b.getElementsByTagName(e)[0];
                      s.parentNode.insertBefore(t,s)}(window, document,'script',
                      'https://connect.facebook.net/en_US/fbevents.js');
                      fbq('init', '${p.pixelId}');
                      fbq('track', 'PageView');
                      ${(JSON.parse(p.events || "[]")).map((e: string) => `fbq('track', '${e}');`).join("\n")}
                    `,
                  }}
                />
              </React.Fragment>
            );

          case "google_analytics":
            return (
              <React.Fragment key={p.id}>
                <Script
                  id={`ga-pixel-${p.id}`}
                  src={`https://www.googletagmanager.com/gtag/js?id=${p.pixelId}`}
                  strategy="afterInteractive"
                />
                <Script
                  id={`ga-config-${p.id}`}
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${p.pixelId}');
                      ${(JSON.parse(p.events || "[]")).map((e: string) => `gtag('event', '${e}');`).join("\n")}
                    `,
                  }}
                />
              </React.Fragment>
            );

          case "google_ads":
            return (
              <React.Fragment key={p.id}>
                <Script
                  id={`gads-pixel-${p.id}`}
                  src={`https://www.googletagmanager.com/gtag/js?id=${p.pixelId}`}
                  strategy="afterInteractive"
                />
                <Script
                  id={`gads-config-${p.id}`}
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${p.pixelId}');
                    `,
                  }}
                />
              </React.Fragment>
            );

          case "tiktok":
            return (
              <React.Fragment key={p.id}>
                <Script
                  id={`tt-pixel-${p.id}`}
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      !function (w, d, t) {
                        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndLog=function(t,e){return function(){t.setAndLog?t.setAndLog.apply(t,arguments):console.log("Anthem: login success")}};for(var i=0;i<ttq.methods.length;i++)ttq[ttq.methods[i]]=ttq.setAndLog(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)e[ttq.methods[n]]=ttq.setAndLog(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                        ttq.load('${p.pixelId}');
                        ttq.page();
                        ${(JSON.parse(p.events || "[]")).map((e: string) => `ttq.track('${e}');`).join("\n")}
                      }(window, document, 'ttq');
                    `,
                  }}
                />
              </React.Fragment>
            );

          case "linkedin":
            return (
              <React.Fragment key={p.id}>
                <Script
                  id={`li-pixel-${p.id}`}
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      _linkedin_partner_id = "${p.pixelId}";
                      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                      (function(l) {
                      if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                      window.lintrk.q=[]}
                      var s = document.getElementsByTagName("script")[0];
                      var b = document.createElement("script");
                      b.type = "text/javascript";b.async = true;
                      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                      s.parentNode.insertBefore(b, s);})(window.lintrk);
                    `,
                  }}
                />
              </React.Fragment>
            );

          case "clarity":
            return (
              <Script
                key={p.id}
                id={`clarity-${p.id}`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "${p.pixelId}");
                  `,
                }}
              />
            );

          case "hotjar":
            return (
              <Script
                key={p.id}
                id={`hotjar-${p.id}`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:${p.pixelId},hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                  `,
                }}
              />
            );

          case "custom":
            return (
              <Script
                key={p.id}
                id={`custom-${p.id}`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: p.pixelId, // User provides the full script
                }}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}
