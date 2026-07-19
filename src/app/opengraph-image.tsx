import { ogSize, ogContentType, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage(
    "AI Systems for Trades & Service Businesses",
    "Stop running your business. Let it run itself."
  );
}
