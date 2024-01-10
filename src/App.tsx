import { useState, useEffect } from "react";
import MiRouter from "./router/Router";
import { BaseDirectory, readTextFile } from '@tauri-apps/api/fs'
import { TokenContext } from "./utils/context";
import "./App.css";

function App() {

  const [token, setToken] = useState()
  const [servidor, setServidor] = useState<string>('')

  const initConf = async () => {

    const result: string = await readTextFile('conf.json', { dir: BaseDirectory.Resource })

    const jsonParse = JSON.parse(result)

    setServidor(jsonParse.servidor)
  }

  useEffect(() => {
    initConf()
  }, [])

  return (
    <TokenContext.Provider value={{ token, setToken, servidor, setServidor }}>
      <MiRouter />
    </TokenContext.Provider>
  );
}

export default App;
