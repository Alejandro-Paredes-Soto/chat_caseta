import React, { useState, useContext } from 'react'
import { Form, Input, Modal, Alert, notification } from "antd"
import { BaseDirectory, readTextFile, writeFile } from '@tauri-apps/api/fs'
import { TokenContext } from './../utils/context'


const ModalComponent = ({ open, setOpen }: { open: boolean, setOpen: any }) => {

    const [password, setPassword] = useState<string>('')
    const [server, setServer] = useState<string>('')
    const [showServer, setShowServer] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [api, contextHolder] = notification.useNotification()

    const { setServidor } = useContext(TokenContext)



    const onClickCancel = () => {
        setOpen(false);
        setPassword('');
        setShowServer(false);
        setServer('');
    }

    const onClickOK = async () => {

        const result: string = await readTextFile('conf.json', { dir: BaseDirectory.Resource })

        const jsonParse = JSON.parse(result)


        if (password !== jsonParse['passwordConf']) {
            setError(true)
            setShowServer(false)
        } else {
            setShowServer(true)
            setError(false)
        }

        if (server.length > 0) {
            jsonParse['servidor'] = server
            setServidor(server)

            await writeFile('conf.json', JSON.stringify(jsonParse), { dir: BaseDirectory.Resource })

            onClickCancel()

            setTimeout(() => {
                api.success({
                    message: 'Se guardaron los cambios de manera exitosa.',
                    type: 'success',
                    duration: 4
                })
            }, 2000)

        }

    }

    return (
        <>
            {contextHolder}
            <Modal
                open={open}
                title='Configuración'
                okText='Aceptar'
                cancelText='Cancelar'
                onCancel={onClickCancel}
                onOk={onClickOK}
            >

                {
                    !showServer ?
                        (
                            <>
                                <Input.Password
                                    style={{ marginTop: '30px', marginBottom: '20px' }}
                                    placeholder="Contraseña"
                                    // value={password}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        if (event && event.target && event.target.value) {
                                            setPassword(event.target.value)
                                        }
                                    }}
                                />
                                {error ? <Alert showIcon message={'Contraseña incorrecta'} type='error' /> : null}
                            </>
                        ) : <Form>
                            <Form.Item>
                                <Input
                                    addonBefore='https://'
                                    placeholder='servidor'
                                    //value={server} 
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        if (event && event.target && event.target.value) {
                                            setServer(event.target.value)
                                        }
                                    }} />
                            </Form.Item>
                        </Form>
                }

            </Modal>
        </>

    )
}


export default ModalComponent