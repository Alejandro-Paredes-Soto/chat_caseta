import { Card, Button, Input, Alert, notification } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { UsuariosI } from './../models/Usuarios.interface'
import useLogin from './../hooks/useLogin'
import { useNavigate } from 'react-router-dom'
import { TokenContext } from './../utils/context'
import BtnConf from './../components/BtnConfig'
import { methodGet, methodPost } from './../shared/services/axios.service'
import { readAndWriteFileConf } from './../utils/conf'
import { BaseDirectory, readTextFile } from '@tauri-apps/api/fs'
import './../assets/styles/login.css'

const Login = () => {

    const TOKEN1 = "4j~j-~x*!=_|zW6%:Yw;fx:~|_:bR_~+!EYR4E.-=2X*q:~!6c-;.Av%5|!F*|2-8e=8F.|.-5+*:m.!%79f::%:+2+J%=!;C5~-";

    const [dataUser, setDataUser] = useState<UsuariosI[]>([])
    const [statusDataUser, setStatusDataUser] = useState<number>(200)

    const [user, setUser] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const { servidor, token, setToken } = useContext(TokenContext)

    const { onLgniC2 } = useLogin({ user, password })


    notification.config({
        maxCount: 1
    })
    const [api, contextHolder] = notification.useNotification({
        maxCount: 1
    });

    const router = useNavigate()

    notification.config({
        maxCount: 1
    })

    const initLgniC = async () => {
        try {

            const respLgniC = await methodPost(servidor, 'LgniC', '', { L: TOKEN1 })
            const { status, data } = await respLgniC

            if (status == 200) {
                setToken(data.T)
                await readAndWriteFileConf(servidor, data.T)
            } else if (status == 500) {
                api.error({ message: 'Error interno del servidor', type: 'error' })
            }

        } catch (error: any) {

            api.error({ message: error.message, type: 'error' })
        }

    }

    const initUsers = async () => {

        try {

            const respUsers = await methodGet(servidor, 'Usuarios', token)
            const { status, data } = respUsers

            if (status == 200) {
                setStatusDataUser(200)
                setDataUser(data)
            } else if (status == 500) {
                api.error({ message: 'Error interno del servidor', type: 'error' })
            }

        } catch (error: any) {
            setStatusDataUser(500)
            setDataUser([])

            api.error({ message: error.message, type: 'error' })
        }
    }

    useEffect(() => { initLgniC(); initUsers() }, [servidor, token])

    const onClickUserSelect = (user: UsuariosI) => {

        if (user) {

            setUser(user.U)

            const ul = document.querySelector('ul');

            if (ul !== null) {
                ul.querySelectorAll('li').forEach((item) => {

                    if (item.title == user.U) {
                        item.style.background = '#E8E8E8'
                    } else {
                        item.style.background = 'white'
                    }

                });
            }

        }

    }

    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.value != '') {
            setPassword(event.target.value)
        }
    }

    return (
        <>
            {contextHolder}
            <div className='login'>


                <Card className='card'>

                    <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Selecciona un usuario</h2>

                    <div className="list-usuarios">
                        <ul>
                            {
                                dataUser && dataUser.length > 0 ?
                                    (
                                        dataUser.map((user) => {
                                            return <li
                                                key={user.I}
                                                title={user.U}
                                                onClick={() => {
                                                    onClickUserSelect(user)
                                                }}
                                            >
                                                {user.U.length > 20 ? `${user.U.slice(0, 20)}...` : user.U}
                                            </li>
                                        })
                                    ) : statusDataUser == 500 ? <Alert
                                        message='Error'
                                        description='Ha ocurrido un error al obtener los usuarios'
                                        showIcon
                                        type='error' /> : <Alert message='Uy' description='Sin usuarios disponibles, reconectando....' showIcon type='warning' />
                            }
                        </ul>
                        <Input.Password className='password' placeholder='Contraseña' onChange={onChangePassword} />

                        <Button className='btnLogin' type='primary' size='large' loading={loading} onClick={async () => {

                            const result: string = await readTextFile('conf.json', { dir: BaseDirectory.Resource })
                            const jsonParse = JSON.parse(result)

                            if (jsonParse['servidor'].length == 0) {
                                api.error({ message: 'Error', description: 'Falta configurar el servidor', type: 'error' })
                                return
                            }
                            if (user.length == 0) {
                                api.error({ message: 'Error', description: 'No has seleccionado usuario', type: 'error' })
                                return
                            }
                            if (password.length == 0) {
                                api.error({ message: 'Error', description: 'Ingresa tu contraseña', type: 'error' })
                                return
                            }

                            setLoading(true)

                            const { status } = await onLgniC2()

                            setLoading(false)


                            if (status != 200) {
                                api.error({
                                    message: 'Error',
                                    description: 'Usuario y/o Contraseña incorrectos',
                                    duration: 5,
                                    type: 'error'
                                })
                                return;
                            }

                            router('/chat')

                        }}>Entrar</Button>
                    </div>

                </Card>
            </div>

            <BtnConf />

        </>
    )

}

export default Login