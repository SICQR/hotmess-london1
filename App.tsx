import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { RadioProvider } from "./contexts/RadioContext";
import { PlayerProvider } from "./components/player/PlayerProvider";
import { AppContent } from "./components/AppContent";

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <RadioProvider>
            <PlayerProvider>
              <AppContent />
            </PlayerProvider>
          </RadioProvider>
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}
