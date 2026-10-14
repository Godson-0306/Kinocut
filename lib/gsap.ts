"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    // cubic-bezier(0.22, 1, 0.36, 1) as a normalized ease curve.
    CustomEase.create("signature", "M0,0 C0.22,1 0.36,1 1,1");
    registered = true;
  }
  return { gsap, ScrollTrigger };
}
