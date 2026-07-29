import { ogSize, ogContentType, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage("Request a Change", "Need something changed? We're a friendly bunch.");
}
