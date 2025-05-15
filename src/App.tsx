import { AuthProvider } from "./contexts/AuthContext";
import AppRouter from "./router/AppRouter";
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
