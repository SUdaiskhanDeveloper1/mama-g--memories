/** Browser-side image optimisation. The untouched original is uploaded separately, so quality is never lost. */
export interface Optimised { full: Blob; thumb: Blob; width: number; height: number; ext: "webp" | "jpg" }

async function bitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try { return await createImageBitmap(file, { imageOrientation: "from-image" }); } catch {}
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

function draw(src: ImageBitmap | HTMLImageElement, max: number, type: string, q: number): Promise<{ blob: Blob; w: number; h: number }> {
  const sw = "naturalWidth" in src ? src.naturalWidth : src.width;
  const sh = "naturalHeight" in src ? src.naturalHeight : src.height;
  const k = Math.min(1, max / Math.max(sw, sh));
  const w = Math.round(sw * k), h = Math.round(sh * k);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src as CanvasImageSource, 0, 0, w, h);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res({ blob: b, w, h }) : rej(new Error("encode failed"))), type, q));
}

export async function optimiseImage(file: File): Promise<Optimised> {
  const src = await bitmap(file);
  let type = "image/webp";
  let big = await draw(src, 2200, type, 0.84);
  if (big.blob.type !== "image/webp") { type = "image/jpeg"; big = await draw(src, 2200, type, 0.86); }
  const small = await draw(src, 640, type, 0.78);
  return { full: big.blob, thumb: small.blob, width: big.w, height: big.h, ext: type === "image/webp" ? "webp" : "jpg" };
}

export const MB = 1024 * 1024;
export const fmtSize = (n: number) => (n > MB ? `${(n / MB).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);
