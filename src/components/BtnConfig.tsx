import { useState } from 'react'
import { SettingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import ModalComponent from './ModalComponent'

const BtnConf = () => {

    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Button
                style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#C52EE7', color: 'white' }}
                onClick={() => setOpen(true)}
            >
                <SettingOutlined />
            </Button>

            <ModalComponent open={open} setOpen={setOpen} />
        </>
    )
}


export default BtnConf