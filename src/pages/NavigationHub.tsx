/**
 * NAVIGATION HUB
 * Central hub for navigating between main app sections
 * HOTMESS dark neon kink aesthetic
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface NavigationHubProps {
  onNavigate: (route: string) => void;
}

export function NavigationHub({ onNavigate }: NavigationHubProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000',
      paddingTop: '80px',
      paddingBottom: '120px'
    }}>
      {/* Header */}
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#000000',
        borderBottom: '1px solid #FF1F8F',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 50
      }}>
        <button
          onClick={() => onNavigate('home')}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: 700
          }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ 
          fontSize: '48px',
          fontWeight: 900,
          color: '#FF1F8F',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Navigation Hub
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {/* Main sections */}
          <NavCard 
            title="Night Pulse"
            description="3D globe & live beacons"
            onClick={() => onNavigate('nightPulse')}
          />
          <NavCard 
            title="Beacons"
            description="Manage your beacons"
            onClick={() => onNavigate('beaconsManage')}
          />
          <NavCard 
            title="Tickets"
            description="Events & ticket resale"
            onClick={() => onNavigate('tickets')}
          />
          <NavCard 
            title="Shop"
            description="Marketplace & drops"
            onClick={() => onNavigate('shop')}
          />
          <NavCard 
            title="Connect"
            description="Messages & hookups"
            onClick={() => onNavigate('connect')}
          />
          <NavCard 
            title="Profile"
            description="Your account & XP"
            onClick={() => onNavigate('profile')}
          />
        </div>
      </div>
    </div>
  );
}

interface NavCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

function NavCard({ title, description, onClick }: NavCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#0A0A0A',
        border: '1px solid #FF1F8F',
        borderRadius: '12px',
        padding: '24px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#FF1F8F';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#0A0A0A';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ 
        fontSize: '24px',
        fontWeight: 900,
        color: '#FFFFFF',
        marginBottom: '8px'
      }}>
        {title}
      </div>
      <div style={{ 
        fontSize: '14px',
        fontWeight: 400,
        color: '#999999'
      }}>
        {description}
      </div>
    </button>
  );
}
