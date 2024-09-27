"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const InfoPage = () => {
  const pathname = usePathname();
  const statePath = pathname.replace("/info", ""); // Remove /info

  return (
    <div>
      info page
      <Link href={`${statePath}/data`}>data</Link>
    </div>
  );
};

export default InfoPage;
