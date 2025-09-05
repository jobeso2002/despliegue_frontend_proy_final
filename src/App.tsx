import { useEffect } from "react";
import { RoutesIndex } from "./routes/route";
import { useAuthStore } from "./store/authstore";
import { Toaster } from "sonner";

function App() {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return (
    <>
      <RoutesIndex />
      <Toaster position="top-right" richColors />{" "}
      {/*toaster llamado para las notificaciones */}
    </>
  );
}

export default App;
