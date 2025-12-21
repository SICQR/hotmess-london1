import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hotmess/ui';
import { DESIGN_TOKENS, RADIO } from '@hotmess/design-system';
import { crossPromotionEngine } from '@hotmess/cross-promotions';

function App() {
  return (
    <div style={{ 
      backgroundColor: DESIGN_TOKENS.colors.wetBlack, 
      color: DESIGN_TOKENS.colors.white,
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: DESIGN_TOKENS.typography.display.fontSize,
          fontWeight: DESIGN_TOKENS.typography.display.fontWeight,
          color: DESIGN_TOKENS.colors.hot,
          marginBottom: '2rem'
        }}>
          RAW CONVICT RECORDS
        </h1>
        
        <p style={{ 
          fontSize: DESIGN_TOKENS.typography.h3.fontSize,
          marginBottom: '3rem',
          color: DESIGN_TOKENS.colors.steel
        }}>
          {RADIO.tagline}
        </p>

        <Card style={{ 
          backgroundColor: DESIGN_TOKENS.colors.charcoal, 
          border: `2px solid ${DESIGN_TOKENS.colors.hot}`
        }}>
          <CardHeader>
            <CardTitle style={{ color: DESIGN_TOKENS.colors.neonLime }}>
              Coming Soon
            </CardTitle>
            <CardDescription style={{ color: DESIGN_TOKENS.colors.steel }}>
              RAW Convict Records standalone app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: DESIGN_TOKENS.colors.white }}>
              Music releases, SoundCloud integration, and artist profiles.
            </p>
            <p style={{ color: DESIGN_TOKENS.colors.steel, marginTop: '1rem' }}>
              This is a separate app that shares UI components, design tokens, and cross-promotion
              intelligence with the main HOTMESS platform.
            </p>
          </CardContent>
        </Card>

        <div style={{ marginTop: '3rem', color: DESIGN_TOKENS.colors.steel }}>
          <h3 style={{ 
            fontSize: DESIGN_TOKENS.typography.h4.fontSize,
            marginBottom: '1rem',
            color: DESIGN_TOKENS.colors.cyanStatic
          }}>
            Features Coming:
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>🎵 Latest Releases</li>
            <li>🎧 Artist Profiles</li>
            <li>🔊 SoundCloud Integration</li>
            <li>💿 RAW Convict Radio Live Stream</li>
            <li>🎯 XP Rewards for Streaming</li>
            <li>🔥 Cross-Promotion with Main Platform</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
