import { useEffect } from "react";
import { initSiteMotion } from "../lib/motion";

export default function useSiteMotion() {
  useEffect(() => initSiteMotion(), []);
}