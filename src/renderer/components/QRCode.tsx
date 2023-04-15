import { FC, useMemo } from 'react';
import qrcodegen from '@ribpay/qr-code-generator';

interface Props {
  text: string;
  innerPadding?: number;
}

const QRC = qrcodegen.QrCode;

const DEFAULT_INNER_PADDING = 4;

export const QRCode: FC<Props> = ({ text, innerPadding = DEFAULT_INNER_PADDING }) => {
  const qr = useMemo(() => QRC.encodeText(text, QRC.Ecc.MEDIUM), [text]);
  const viewBoxSize = qr.size + innerPadding * 2;

  const parts = useMemo(() => {
    if (innerPadding < 0) {
      throw new RangeError('Inner padding must be non-negative');
    }

    const parts: string[] = [];

    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (qr.getModule(x, y)) {
          parts.push(`M${x + innerPadding},${y + innerPadding}h1v1h-1z`);
        }
      }
    }

    return parts.join(' ');
  }, [text]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      stroke="none"
      className="w-[200px]"
    >
      <rect width="100%" height="100%" className="fill-[hsl(var(--nc))]" />
      <path d={parts} className="fill-[hsl(var(--n))]" />
    </svg>
  );
};
