import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home screen icon: the full mark on the page background. */
export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), "public/brand/suuui-mark.svg"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#131116",
        }}
      >
        <img src={`data:image/svg+xml;base64,${svg.toString("base64")}`} width={116} height={116} alt="" />
      </div>
    ),
    size,
  );
}
