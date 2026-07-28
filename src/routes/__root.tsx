import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/lib/theme-context";
import { CartProvider } from "@/lib/cart-context";
import { LocationProvider } from "@/lib/location-context";
import { LocationPicker } from "@/components/LocationPicker";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The dish you're looking for wandered off. Try the menu instead.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90">
            Go home
          </Link>
          <Link to="/menu" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-bold hover:bg-secondary">
            Browse menu
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
          >Try again</button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-bold hover:bg-secondary">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kabir's Kitchen — Cloud Kitchen Delivery" },
      { name: "description", content: "Order Indian, Chinese, Arabian and desserts — fresh, hygienic, delivered hot." },
      { name: "author", content: "Kabir's Kitchen" },
      { property: "og:title", content: "Kabir's Kitchen — Cloud Kitchen Delivery" },
      { property: "og:description", content: "Order Indian, Chinese, Arabian and desserts — fresh, hygienic, delivered hot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kabir's Kitchen — Cloud Kitchen Delivery" },
      { name: "twitter:description", content: "Order Indian, Chinese, Arabian and desserts — fresh, hygienic, delivered hot." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/09bf6061-762f-459d-9455-879e9dc596c3/id-preview-b31c9d01--037d96b6-5240-4d05-a6d0-6b74a6a3747e.lovable.app-1784905198383.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/09bf6061-762f-459d-9455-879e9dc596c3/id-preview-b31c9d01--037d96b6-5240-4d05-a6d0-6b74a6a3747e.lovable.app-1784905198383.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocationProvider>
          <CartProvider>
            <Outlet />
            <LocationPicker />
          </CartProvider>
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
