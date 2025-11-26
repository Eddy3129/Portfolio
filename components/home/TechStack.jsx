"use client";

import dynamic from "next/dynamic";

const TechStackInner = dynamic(() => import("./TechStackInner"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full" />,
});

export default function TechStack() {
  return <TechStackInner />;
}
