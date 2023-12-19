import { useEffect, useState } from 'react';
import { ColonosI } from '../models/Colonos.interface.';
import { Chat } from '../models/Chat.interface';
import './../assets/styles/casilla.css'
import socket from './../shared/services/socket.service';

const Casilla = (
    { colonoSelected, onClickRemoveColono, setColonoSelected }:
        { colonoSelected: ColonosI[], onClickRemoveColono: any, setColonoSelected: any }) => {

    const [dataChat, setDataChat] = useState<Chat[]>([])

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


    const sendMessageCaseta = (event: React.KeyboardEvent, colono: ColonosI): void => {
        if (event && event.key == 'Enter') {


            socket.emit('sendMessage', (
                {
                    idRoom: `CASETA-1-COLONO-${colono.Id}`,
                    dateCreation: new Date(),
                    idParticipant: 1,
                    messageCaseta: colono.msgCaseta && colono.msgCaseta.replace(/\n/g, ' ').trim(),
                }))

            event.target.value = ''


        }
    }

    useEffect(() => {
        socket.on('onMessage', (objOnMessage) => {
            setDataChat((prevDataChat) => ([...prevDataChat, objOnMessage]))
        })

        return () => {
            socket.off('onMessage')
        }
    }, [])


    return (
        <>
            {console.log(dataChat)}
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
                                                colono.Nombre &&
                                                    colono.Nombre.trim().length <= 15 ?
                                                    colono.Nombre : `${colono.Nombre && colono.Nombre.slice(0, 15)}...`}</span>

                                            <span>#{
                                                colono.Numero &&
                                                    colono.Numero.trim().length <= 15 ?
                                                    colono.Numero : `${colono.Numero && colono.Numero.slice(0, 15)}...`}</span>
                                        </div>

                                        <div className="btns-close">
                                            <button onClick={() => onClickMinizarCasilla(colono.Id)}>-</button>
                                            <button onClick={() => onClickRemoveColono(colono.Id)} >X</button>
                                        </div>
                                    </div>

                                    <div style={{ display: colono.displayBoxListMessages }}>
                                        <div className="list-messages" style={{ height: '205px' }}>

                                            {
                                                dataChat.length > 0 ?
                                                    (
                                                        dataChat.map((chat) => {
                                                            if (chat.idRoom == `CASETA-1-COLONO-${colono.Id}`) {

                                                                //if (chat.messageCaseta != '') {
                                                                return <>
                                                                    {
                                                                        chat.messageCaseta && chat.messageCaseta != '' ?
                                                                            (
                                                                                <div className='item-message' style={{ justifyContent: 'flex-start' }}>
                                                                                    <div className="message" style={{ background: '#63A2EE' }}>
                                                                                        {chat.messageCaseta}
                                                                                    </div>
                                                                                </div>
                                                                            ) : null
                                                                    }


                                                                    {
                                                                        chat.messageColono && chat.messageColono != '' ?
                                                                            (
                                                                                <div
                                                                                    className="item-message"
                                                                                    style={{ justifyContent: 'flex-end' }}
                                                                                >
                                                                                    <div className="message" style={{ background: '#F13535' }}>
                                                                                        {chat.messageColono}
                                                                                    </div>
                                                                                </div>
                                                                            ) : null
                                                                    }

                                                                </>
                                                                //}

                                                            }
                                                        })
                                                    ) : null
                                            }

                                        </div>
                                    </div>

                                    <textarea
                                        onKeyUp={(event) => sendMessageCaseta(event, colono)}
                                        onChange={(event) => setColonoSelected((prevColonoSelected) => (prevColonoSelected.map((colonoPrev) => {
                                            if (colonoPrev.Id == colono.Id) {
                                                colonoPrev.msgCaseta = event.target.value
                                            }
                                            return colonoPrev
                                        })))}
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