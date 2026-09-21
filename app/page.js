"use client";

import dynamic from "next/dynamic";

const PostWayApp = dynamic(() => import("@/components/PostWayApp"), { ssr: false });

export default function Page() {
  return <PostWayApp />;
}
