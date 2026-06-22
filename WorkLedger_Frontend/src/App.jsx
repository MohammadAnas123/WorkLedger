import { useEffect, useState } from "react";
import TopBar from "./components/layout/TopBar";
import LoadingState from "./components/layout/LoadingState";
import Dashboard from "./pages/Dashboard";
import NewClientForm from "./pages/NewClientForm";
import ClientDetail from "./pages/ClientDetail";
import ReceiptView from "./pages/ReceiptView";
import Reports from "./pages/Reports";
import { useToast } from "./hooks/useToast";
import { listClients } from "./api/clients";

export default function App() {
  const [route, setRoute] = useState({ name: "dashboard" });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  const refreshClients = async () => {
    const list = await listClients();
    setClients(list);
  };

  useEffect(() => {
    (async () => {
      await refreshClients();
      setLoading(false);
    })();
  }, []);

  const goto = (name, params = {}) => setRoute({ name, ...params });

  return (
    <div className="wl-root">
      {route.name !== "receipt" && <TopBar route={route} goto={goto} />}

      <main className={route.name === "receipt" ? "wl-print-main" : "wl-main"}>
        {loading ? (
          <LoadingState />
        ) : route.name === "dashboard" ? (
          <Dashboard clients={clients} goto={goto} />
        ) : route.name === "newClient" ? (
          <NewClientForm
            goto={goto}
            onCreated={async (c) => {
              await refreshClients();
              showToast(`Added ${c.name}`);
              goto("client", { id: c.id });
            }}
          />
        ) : route.name === "client" ? (
          <ClientDetail
            clientId={route.id}
            goto={goto}
            showToast={showToast}
            onClientChanged={refreshClients}
          />
        ) : route.name === "receipt" ? (
          <ReceiptView clientId={route.id} goto={goto} />
        ) : route.name === "reports" ? (
          <Reports goto={goto} />
        ) : null}
      </main>

      {toast && <div className="wl-toast">{toast}</div>}
    </div>
  );
}
