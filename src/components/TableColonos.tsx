import { useEffect, useState } from 'react';
import './../assets/styles/tablecolonos.css'
import Casilla from './Casilla';
import { ColonosI } from '../models/Colonos.interface.';
import { Tooltip } from 'antd';
import { trpc } from './../shared/services/trpc';
import socket from './../shared/services/socket.service';

const TableColonos = ({ showTable }: { showTable: boolean }) => {

    const { data } = trpc.caseta.chat.getColonos.useQuery();
    const [newDataColonos, setNewDataColonos] = useState<Array<[string, ColonosI[]]>>([])
    const [colonoSelected, setColonoSelected] = useState<ColonosI[]>([])

    useEffect(() => {

        if (data) {
            const arrayColonos = data.reduce((acc, obj) => {

                if (acc[obj.Nombre]) {
                    acc[obj.Nombre].push(obj)
                } else {
                    acc[obj.Nombre] = [obj]
                }
                return acc
            }, {})
            setNewDataColonos(Object.entries(arrayColonos))
        }

    }, [data])

    const onClickSelectedColono = (dataColono: ColonosI) => setColonoSelected((prevColonoSelected) => {

        let findColono = prevColonoSelected.find((colono) => colono.Id == dataColono.Id)

        return !findColono ? [dataColono, ...prevColonoSelected] : [...prevColonoSelected]

    })

    useEffect(() => {

        socket.on('onMessage', (onObjMessage) => {

            setColonoSelected((prevColonoSelected) => {

                let findColonoExist = prevColonoSelected.find((colono) => colono.Id == Number(onObjMessage.idRoom.split('-')[3]))

                return !findColonoExist ? [{
                    Id: Number(onObjMessage.idRoom.split('-')[3]),
                    Nombre: onObjMessage.nombreCalle,
                    Numero: onObjMessage.numeroExt,
                    displayBoxListMessages: 'block',
                    displayTextArea: 'block',
                    heightCard: '325px',
                    minimizar: false
                }, ...prevColonoSelected] :

                    [...prevColonoSelected]
            })
        })


        return () => {
            socket.off('onMessage')
        }
    }, [])


    const onClickRemoveColono = (idColono: number): void => {
        let filter = colonoSelected.filter((colono) => colono.Id != idColono)
        setColonoSelected(filter)
    }

    const onClickPositionColonos = (colono: ColonosI) => {

        let indexColono: number = colonoSelected.findIndex((colonoIndex) => colonoIndex.Id == colono.Id)

        if (indexColono != -1) {
            setColonoSelected((prevColonoSelected) => {

                const newArray = [...prevColonoSelected]
                const colonoChangePosition = newArray.splice(indexColono, 1)[0]
                newArray.unshift(colonoChangePosition)
                return newArray
            })
        }
    }

    return (
        <>
            <div style={{ display: showTable ? 'block' : 'none' }}>
                <div className="mi-tabla">
                    {
                        newDataColonos.length > 0 ?
                            (
                                newDataColonos.map((colono, indexColono) => {

                                    return <div key={indexColono}>
                                        <div className='header-colono'>
                                            {colono[0]}
                                        </div>

                                        <div
                                            className='calle-colono'>
                                            {

                                                (colono[1] && colono[1].length > 0) ?
                                                    (
                                                        colono[1].map((calle) => {
                                                            //Iniciando salas con todos los colonos
                                                            socket.emit('sendRoom', { idRoom: `CASETA-1-COLONO-${calle.Id}` })

                                                            return <div
                                                                key={calle.Id}
                                                                onClick={() => onClickSelectedColono(calle)}
                                                            >

                                                                <b>#</b> {calle.Numero}
                                                            </div>
                                                        })
                                                    ) : null
                                            }
                                        </div>
                                    </div>
                                })
                            ) : null
                    }
                </div>
            </div>

            <div className='row-casillas'>

                {
                    colonoSelected.length > 3 ?
                        (
                            <Tooltip
                                title={
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {
                                            colonoSelected.slice(3, colonoSelected.length).map((colono) => {


                                                return <span
                                                    onClick={() => onClickPositionColonos(colono)}
                                                    className='cola-colonos'
                                                    key={colono.Id}>
                                                    {colono.Nombre} #{colono.Numero}
                                                </span>
                                            })
                                        }
                                    </div>}
                                placement='top'
                                trigger={'hover'}
                            >
                                <div className="cola">
                                    <span>{colonoSelected.slice(3, colonoSelected.length).length}</span>
                                </div>
                            </Tooltip>
                        ) : null
                }

                <Casilla
                    colonoSelected={colonoSelected}
                    onClickRemoveColono={onClickRemoveColono}
                    setColonoSelected={setColonoSelected}

                />
            </div>
        </>
    );
}

export default TableColonos