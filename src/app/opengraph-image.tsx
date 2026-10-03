import { ImageResponse } from 'next/og';
import { profile } from '@/data/site';

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#f1f1ed',
          backgroundImage:
            'linear-gradient(#dfe0db 1px, transparent 1px), linear-gradient(90deg, #dfe0db 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          color: '#16171a',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: '#65676e' }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: '#2748b8' }} />
          {`${profile.location} · available for new roles`}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 112, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ fontSize: 44, marginTop: 20, color: '#43454b' }}>
            {profile.role}
          </div>
          <div style={{ fontSize: 30, marginTop: 14, color: '#65676e' }}>{profile.tagline}</div>
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 26, color: '#1e3a94', fontStyle: 'italic' }}>
          <span>DeepShield</span>
          <span>Arabia Hills</span>
          <span>WePsych</span>
          <span>BudgetBuddy</span>
          <span>ALFA Club</span>
        </div>
      </div>
    ),
    size
  );
}
