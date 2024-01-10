import { useState } from 'react'
import BtnFloat from "../components/BtnFloat"
import TableColonos from "../components/TableColonos";
import BtnLogout from '../components/BtnLogout';

const Chat = () => {

  const [showTable, setShowTable] = useState<boolean>(false)

  const onClickShowTable = (): void => {
    setShowTable(showTable == true ? false : true)
  }



  return (<div>
    <TableColonos showTable={showTable} />
    <BtnFloat onClickShowTable={onClickShowTable} />
    <BtnLogout />
  </div>)
}

export default Chat;