import { useRef, useEffect, useState } from "react";

type PixelatedImageProps = {
  src?: string;
  pixelSize?: number;
};

export const PixelatedImage = ({ src, pixelSize = 10 }: PixelatedImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("4/5");

  useEffect(() => {
    if(!src) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const safePixelSize = Math.max(1, pixelSize);

    const img = new Image();

    img.src = src;

    img.onload = () => {
      const { width, height } = img;
      setAspectRatio(`${width}/${height}`);

      // Establecer el tamaño del canvas manualmente
      canvas.width = width;
      canvas.height = height;

      const scaledW = Math.max(1, Math.ceil(width / safePixelSize));
      const scaledH = Math.max(1, Math.ceil(height / safePixelSize));

      // Crear canvas temporal
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = scaledW;
      tempCanvas.height = scaledH;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      // Dibujar imagen reducida
      tempCtx.drawImage(img, 0, 0, scaledW, scaledH);

      // Dibujar imagen escalada (pixeleada)
      ctx.imageSmoothingEnabled = safePixelSize > 1 ? false : true;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(tempCanvas, 0, 0, scaledW, scaledH, 0, 0, width, height);
    };
  }, [src, pixelSize]);

  return <canvas ref={canvasRef} style={{aspectRatio, width: "400px"}} />;
};
