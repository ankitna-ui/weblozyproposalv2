import { useState, useEffect } from 'react';

export function useLogoBackground(imageUrl: string | undefined) {
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isTransparent, setIsTransparent] = useState<boolean>(true);

  useEffect(() => {
    if (!imageUrl) {
      setBgColor('#ffffff');
      setIsTransparent(true);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0);
        
        // Sample 4 corners
        const tl = ctx.getImageData(0, 0, 1, 1).data;
        const tr = ctx.getImageData(img.width - 1, 0, 1, 1).data;
        const bl = ctx.getImageData(0, img.height - 1, 1, 1).data;
        const br = ctx.getImageData(img.width - 1, img.height - 1, 1, 1).data;
        
        // Check if top-left is transparent (alpha near 0)
        if (tl[3] < 10) {
          setIsTransparent(true);
          setBgColor('#ffffff');
          return;
        }

        // If top-left is solid, verify if all 4 corners match (handles JPG compression artifacts)
        const isSolidBg = 
          Math.abs(tl[0] - tr[0]) < 15 && Math.abs(tl[1] - tr[1]) < 15 && Math.abs(tl[2] - tr[2]) < 15 &&
          Math.abs(tl[0] - bl[0]) < 15 && Math.abs(tl[1] - bl[1]) < 15 && Math.abs(tl[2] - bl[2]) < 15 &&
          Math.abs(tl[0] - br[0]) < 15 && Math.abs(tl[1] - br[1]) < 15 && Math.abs(tl[2] - br[2]) < 15;

        if (isSolidBg) {
          setIsTransparent(false);
          setBgColor(`rgb(${tl[0]}, ${tl[1]}, ${tl[2]})`);
        } else {
          // It's opaque but corners don't match (e.g. a photo or complex logo).
          setIsTransparent(false);
          setBgColor('#ffffff');
        }
      } catch (e) {
        // CORS error or other canvas exception
        console.warn("Could not read logo pixel data due to CORS or other error.", e);
        setIsTransparent(true);
        setBgColor('#ffffff');
      }
    };
    
    // Trigger load
    img.src = imageUrl;
  }, [imageUrl]);

  return { bgColor, isTransparent };
}
