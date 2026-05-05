import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AIVA // Neural Intelligence OS';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050506',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, #00ffd120, transparent)',
            display: 'flex',
          }}
        />
        <div
          style={{
            fontSize: 120,
            fontWeight: 'black',
            color: '#00ffd1',
            letterSpacing: '-0.05em',
            marginBottom: 20,
            display: 'flex',
          }}
        >
          AIVA
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            display: 'flex',
          }}
        >
          Neural Intelligence OS
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
