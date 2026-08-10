import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { getNavigation, getSiteSettings, getSiteImages } from "@/lib/content";

/** Fresh Sanity data on each request (logo / hero images after publish) */
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, navigation, siteImages] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getSiteImages(),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      <Header
        settings={settings}
        navigation={navigation}
        logo={siteImages.logo || settings.logo}
      />
      <PageTransition>
        <main id="site-main" className="flex-1">
          {children}
        </main>
      </PageTransition>
      <Footer settings={settings} navigation={navigation} />
    </div>
  );
}
