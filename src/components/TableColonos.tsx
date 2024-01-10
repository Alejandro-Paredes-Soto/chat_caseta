import React, { useEffect, useState, useContext } from 'react';
import './../assets/styles/tablecolonos.css'
import Casilla from './Casilla';
import { ColonosI } from '../models/Colonos.interface.';
import { Button, Tooltip, Input } from 'antd';
// import socket from './../shared/services/socket.service';
// import { invoke } from '@tauri-apps/api/tauri';
import { methodGet } from './../shared/services/axios.service';
import { DeleteOutlined } from '@ant-design/icons';
import { TokenContext } from './../utils/context';


const TableColonos = ({ showTable }: { showTable: boolean }) => {

    const [newDataColonos, setNewDataColonos] = useState<Array<[string, ColonosI[]]>>([])
    const [colonoSelected, setColonoSelected] = useState<ColonosI[]>([])
    const [dataFilter, setDataFilter] = useState<Array<[string, ColonosI[]]>>([])

    const { servidor, token } = useContext(TokenContext)

    useEffect(() => {

        methodGet(servidor, 'Cht/colonos', token).then((res) => {
            const { data, status } = res

            if (status == 200) {

                const arrayColonos = data.data.reduce((acc: Record<string, ColonosI[]>, obj: ColonosI) => {

                    if (obj.Calle) {

                        if (acc[obj.Calle]) {
                            acc[obj.Calle].push(obj)
                        } else {
                            acc[obj.Calle] = [obj]
                        }
                    }
                    return acc
                }, {})

                setNewDataColonos(Object.entries(arrayColonos))
                setDataFilter(Object.entries(arrayColonos))
            }
        }).catch((reason: any) => {
            setNewDataColonos([])
            console.log('reason')
            console.log(reason)
        })

    }, [servidor])

    const onClickSelectedColono = (dataColono: ColonosI) => setColonoSelected((prevColonoSelected) => {

        let findColono = prevColonoSelected.find((colono) => colono.Id == dataColono.Id)
        return !findColono ? [dataColono, ...prevColonoSelected] : [...prevColonoSelected]
    })

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

    const onFilterData = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.currentTarget.value != '') {

            let search = dataFilter.filter((d) =>
                d[0].replace(/\s+/g, '').toLowerCase().includes(event.currentTarget.value.replace(/\s+/g, '').toLowerCase()) ||
                d[1].some((d1) => d1.Numero?.replace(/\s+/g, '').toLowerCase().includes(event.currentTarget.value.replace(/\s+/g, '').toLowerCase()))
            );
            setNewDataColonos(search)

        } else if (event.currentTarget.value == '') {

            setNewDataColonos(dataFilter)
        }

    }

    return (
        <>

            <div
                style={{ display: showTable ? 'block' : 'none' }}
            >

                <div className="mi-tabla">

                    <Input
                        placeholder='Buscar...'
                        style={{ position: 'fixed', marginTop: '-55px', width: '600px' }}
                        onChange={onFilterData}
                    />

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


                                                return <div style={
                                                    {
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginTop: '10px',
                                                        alignItems: 'center'
                                                    }}>

                                                    <span
                                                        onClick={() => onClickPositionColonos(colono)}
                                                        className='cola-colonos'
                                                        key={colono.Id}>
                                                        {colono.Calle} #{colono.Numero}
                                                    </span>

                                                    <Button
                                                        style={{ marginLeft: '5px' }}
                                                        onClick={() => onClickRemoveColono(colono.Id)}
                                                        type='primary'
                                                        danger
                                                        size='small'>
                                                        <DeleteOutlined />
                                                    </Button>
                                                </div>

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