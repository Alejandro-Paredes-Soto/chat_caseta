import { Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { TokenContext } from './../utils/context'
import './../assets/styles/btnLogout.css'

const BtnLogout = () => {

    const router = useNavigate()
    const { setToken } = useContext(TokenContext)


    return <Button
        title='Cerrar Sesión'
        className='btnLogout'
        type='primary'
        size='large'
        onClick={() => {
            setToken('')
            router('/')
        }}
    >
        <LogoutOutlined />
    </Button>
}

export default BtnLogout;