import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import Footer from "~/components/Footer";
import { useExtensionSync } from "~/hooks/useExtensionSync";

// Expose DB debug functions to window for console access
function useExposeDbDebug() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("~/services/db").then((db) => {
        // @ts-expect-error - Adding to window for debugging
        window.dbDebug = {
          getDatabaseInfo: db.getDatabaseInfo,
          listOPFSFiles: db.listOPFSFiles,
          forceSave: db.forceSave,
          exportDatabase: db.exportDatabase,
          importDatabase: db.importDatabase,
          getAllTexts: db.getAllTexts,
          getAllUnknownWords: db.getAllUnknownWords,
        };
        console.log("[Debug] DB functions available at window.dbDebug");
      });
    }
  }, []);
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="google-site-verification"
          content="wnGkhhW1lxmaRFvaltgi_yFgFd-iftiRmJ20jRbvL2A"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {/* Clarity disabled - incompatible with COEP headers required for SQLite WASM */}
        <Scripts />
        <Footer />
      </body>
    </html>
  );
}

export default function App() {
  useExposeDbDebug();
  useExtensionSync(); // Sincronización con la extensión de Chrome
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
