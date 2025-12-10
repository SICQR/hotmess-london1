import './styles/globals.css';

// 🔓 DEV MODE ONLY: Auth bypass for testing
if (typeof import.meta !== 'undefined' && import.meta.env?.DEV && typeof localStorage !== 'undefined') {
  const currentValue = localStorage.getItem('hotmess_dev_auth_bypass');
  if (currentValue !== 'true') {
    console.log('🔧 [DEV MODE] Enabling auth bypass for testing...');
    localStorage.setItem('hotmess_dev_auth_bypass', 'true');
  }
}

export default function App() {
}