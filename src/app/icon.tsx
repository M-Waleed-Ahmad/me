import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#16171a',
          color: '#f1f1ed',
          fontSize: 40,
          fontFamily: 'serif',
          fontStyle: 'italic',
        }}
      >
        W
        <div style={{ width: 8, height: 8, borderRadius: 8, background: '#7f9cff', marginLeft: 2, marginTop: 22 }} />
      </div>
    ),
    size
  );
}
