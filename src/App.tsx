import MiRouter from "./router/Router";
import "./App.css";
import { useAtomValue } from "jotai";
import { trpcClientAtom, trpcQueryClientAtom, trpc } from "./shared/services/trpc";
import { QueryClientProvider } from "@tanstack/react-query";

function App() {

  const trpcQueryClient = useAtomValue(trpcQueryClientAtom);
  const trpcClient = useAtomValue(trpcClientAtom);

  return (
    <trpc.Provider client={trpcClient} queryClient={trpcQueryClient}>
      <QueryClientProvider client={trpcQueryClient}>
        <MiRouter />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
