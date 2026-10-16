import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The small mark reads better at 16 and 24 px; the full mark is used from 32 px up.
const variants = [
  { id: "16", size: 16, file: "suuui-mark-small.svg" },
  { id: "24", size: 24, file: "suuui-mark-small.svg" },
  { id: "32", size: 32, file: "suuui-mark.svg" },
];

export function generateImageMetadata() {
  return variants.map(({ id, size }) => ({
    id,
    contentType: "image/png",
    size: { width: size, height: size },
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const wanted = await id;
  const { size, file } = variants.find((v) => v.id === wanted) ?? variants[variants.length - 1];
  const svg = await readFile(join(process.cwd(), "public/brand", file));
  return new ImageResponse(
    <img src={`data:image/svg+xml;base64,${svg.toString("base64")}`} width={size} height={size} alt="" />,
    { width: size, height: size },
  );
}
