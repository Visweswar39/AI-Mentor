import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full mx-auto max-w-3xl">
      {children}
    </div>
  );
}
