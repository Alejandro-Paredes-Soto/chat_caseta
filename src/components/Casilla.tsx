import React, { useEffect, useState } from 'react';
import { ColonosI } from '../models/Colonos.interface.';
import { Chat } from '../models/Chat.interface';
import './../assets/styles/casilla.css'
import socket from './../shared/services/socket.service';
import axios from 'axios';
import useNotification from './../hooks/useNotification';
import { NotificationI } from 'models/Notification.interface';


const Casilla = (
    { colonoSelected, onClickRemoveColono, setColonoSelected }:
        { colonoSelected: ColonosI[], onClickRemoveColono: any, setColonoSelected: any }) => {

    const [dataChat, setDataChat] = useState<Chat[]>([])
    const [configNotification, setConfigNotification] = useState<NotificationI>({ type: 'success', description: 'Bien', duration: 5, message: 'message test' })

    const { contextHolder } = useNotification(configNotification)

    //Se obtienes todos los mensajes cuando arranca la app
    useEffect(() => {
        axios.get('http://localhost:10003/Data/ADV/CsE/87/Cht/allMsg', {
            headers: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJIjoxNCwiaWF0IjoxNzA0NDc3NzQyLCJleHAiOjE3MDU2ODczNDIsImF1ZCI6ImNDYXNFIn0.TC3gT7tfNzmtNh8p1qfoWwmKyqn9nkMjGgPNA-FOpSk'
            }
        }).then((d) => {
            if (d.status == 200) {
                setDataChat(d.data)
            }
        }).catch((reason: any) => {
            console.log('error al obtener los mensajes')
        })
    }, [])


    useEffect(() => {

        socket.on('MS', (ms) => {
            setDataChat((prevDataChat) => ([...prevDataChat, ms]))
        })

        return () => { socket.off('MS') }

    }, [])

    useEffect(() => { //Scroll automatico para mostrar el ultimo mensaje enviado
        document.querySelectorAll('div.list-messages').forEach((casilla) => {
            casilla.scrollTop = casilla.scrollHeight
        })
    }, [colonoSelected, dataChat])


    const onClickMinizarCasilla = (idColono: number): void => {

        let minimizarCasilla = colonoSelected.map((colono) => {
            if (colono.Id == idColono) {
                return {
                    ...colono,
                    minimizar: !colono.minimizar,
                    heightCard: colono.minimizar ? '325px' : '30px',
                    displayBoxListMessages: colono.minimizar ? 'block' : 'none',
                    displayTextArea: colono.minimizar ? 'block' : 'none'
                }
            }
            return colono
        })
        setColonoSelected(minimizarCasilla)
    }


    const sendMessageCaseta = async (msg: string, key: string, colono: ColonosI): Promise<void> => {

        if (key && key == "Enter") {

            try {
                const response = await axios.post('http://localhost:10003/Data/ADV/CsE/87/Cht/Msg', {
                    M: msg,
                    A: colono.Id
                }, {
                    headers: {
                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJIjoxNCwiaWF0IjoxNzA0NDc3NzQyLCJleHAiOjE3MDU2ODczNDIsImF1ZCI6ImNDYXNFIn0.TC3gT7tfNzmtNh8p1qfoWwmKyqn9nkMjGgPNA-FOpSk'
                    }
                })

                if (response.status == 200) {
                    setDataChat((prevDataChat) => ([...prevDataChat, { I: colono.Id, M: msg, N: 'Caseta' }]))
                }
            } catch (error: any) {
                setConfigNotification({
                    type: 'error',
                    description: error.message,
                    message: 'Ha ocurrido un error',
                    duration: 5
                })
            }
        }
    }

    return (
        <>

            {contextHolder}

            {
                colonoSelected.length > 0 ?
                    (
                        colonoSelected.map((colono, indexColono) => {

                            if (indexColono < 3) {

                                return <div
                                    id='card'
                                    style={{ height: colono.heightCard }}
                                    key={colono.Id}
                                    className={`${colono.Id}`}
                                >

                                    <div className='header-card'>
                                        <div className='header-card-child'>
                                            <span>{
                                                colono.Calle &&
                                                    colono.Calle.trim().length <= 15 ?
                                                    colono.Calle : `${colono.Calle && colono.Calle.slice(0, 15)}...`}</span>

                                            <span>#{
                                                colono.Numero &&
                                                    colono.Numero.trim().length <= 15 ?
                                                    colono.Numero : `${colono.Numero && colono.Numero.slice(0, 15)}...`}</span>
                                        </div>

                                        <div className="btns-close">
                                            <button style={{ color: 'black', fontWeight: '800' }} onClick={() => onClickMinizarCasilla(colono.Id)}>-</button>
                                            <button style={{ background: '#DF212F', color: 'white', fontWeight: '800' }} onClick={() => onClickRemoveColono(colono.Id)} >X</button>
                                        </div>
                                    </div>

                                    <div style={{ display: colono.displayBoxListMessages }}>
                                        <div className="list-messages" style={{ height: '205px' }}>
                                            {
                                                dataChat.length > 0 ? (

                                                    dataChat.map((chat) => {

                                                        if (chat.N.toLowerCase() === 'caseta' && chat.I == colono.Id) {
                                                            return <>
                                                                <div className='item-message' style={{ justifyContent: 'flex-start' }}>
                                                                    <div className='message' style={{ background: '#63A2EE' }}>
                                                                        {chat.M}

                                                                        <div className='pico1'></div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        } else if (
                                                            chat.N.toLowerCase().replace(/\s+g/, '') == `${colono.Calle?.replace(/\s+g/, '').toLowerCase()} #${colono.Numero?.replace(/\s+g/, '').toLowerCase()}`
                                                            && chat.I == colono.Id
                                                        ) {

                                                            return <>
                                                                <div className="item-message" style={{ justifyContent: 'flex-end' }}>
                                                                    <div className="message" style={{ background: '#F13535' }}>
                                                                        {chat.M}

                                                                        <div className="pico2"></div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                    })

                                                ) : null
                                            }

                                        </div>
                                    </div>

                                    <textarea
                                        onKeyUp={(event) => sendMessageCaseta(event.currentTarget.value, event.key, colono)}
                                        style={{ resize: 'none', height: '30px', width: '98%', outline: 'none', display: colono.displayTextArea }}
                                        cols={30}
                                        rows={10}>
                                    </textarea>
                                </div>
                            }

                        })
                    ) : null
            }
        </>
    );
}

export default Casilla;