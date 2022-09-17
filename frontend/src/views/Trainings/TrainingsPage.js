import React from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormSelect,
    CRow,
    CProgress,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CBadge,
    CToast,
    CToaster,
    CToastHeader,
    CToastBody,
} from '@coreui/react'


import CIcon from '@coreui/icons-react'

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const TrainingsPage = () => {
    const [trainings, setTrainings] = useState([]);
    const [dataSources, setDataSources] = useState([]);
    const [models, setModels] = useState([]);
    const statusMap = {
        "pending": {
            "color": "warning",
            "percentage": 0,
        },
        "fetching": {
            "color": "danger",
            "percentage": 0
        },
        "training": {
            "color": "info",
            "percentage": 50
        },
        "analysing": {
            "color": "4f5d73",
            "percentage": 100
        },
        "finished": {
            "color": "success",
            "percentage": 100
        },
        "failed": {
            "color": "danger",
            "percentage": 100
        }
    }
    useEffect(() => {
        axios.get(process.env.REACT_APP_API_BASE_URL + `/trainings`)
            .then(res => {
                setTrainings(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        axios.get(process.env.REACT_APP_API_BASE_URL + `/datasets`)
            .then(res => {
                setDataSources(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        axios.get(process.env.REACT_APP_API_BASE_URL + `/models`)
            .then(res => {
                setModels(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])



    function submitTraining() {
        let data = { "dataSource": selectedDataSource, "model": model }
        axios.post(process.env.REACT_APP_API_BASE_URL + `/training/start`, data).then(res => {
            window.location.reload()
            console.log(res.data)
        })
            .catch(error => {
                addToast(error_handling(error))
            })
    }

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    <strong>Manuel Eğitim Başlatma</strong> <small></small>
                </CCardHeader>
                <CCardBody>
                    <p className="text-medium-emphasis small">
                        Öğrenme periyotları dışında seçeceğiniz veri kaynağı ve öğrenme kuralı ile eğitim başlatabilirsiniz.
                    </p>
                    <CRow>
                        <CCol md='5'>
                            <CFormSelect
                                onChange={e => setSelectedDataSource(e.target.value)}
                                aria-label="data_sources"
                                options={dataSources}
                            />
                        </CCol>
                        <CCol md='5'>
                            <CFormSelect
                                onChange={e => setModels(e.target.value)}
                                aria-label="learning_rules"
                                options={models}
                            />
                        </CCol>
                        <CCol>
                            <CButton onClick={submitTraining} style={{ color: 'white' }} className='btn btn-success'><CIcon icon={cilMediaPlay} /> Eğitimi Başlat</CButton>
                        </CCol>

                    </CRow>
                    <CRow>
                    </CRow>
                </CCardBody>
            </CCard>

            <CRow>
                <CTable align="middle" className="mb-0 border bg-white dark-table" hover responsive>
                    <CTableHead color="dark">
                        <CTableRow>
                            <CTableHeaderCell className="text-center">Training ID</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">Model</CTableHeaderCell>


                            <CTableHeaderCell className="text-center">Data Source</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">Durum</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">Oluşturulma Zamanı</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {trainings.map((item, index) => (
                            <CTableRow v-for="item in tableItems" key={index}>
                                <CTableDataCell className='text-center' >
                                    {item.id.slice(-12)}
                                </CTableDataCell>
                                <CTableDataCell className='text-center'>
                                    {item.name}
                                </CTableDataCell>
                                <CTableDataCell className='text-center'>
                                    <CBadge color="success" shape="rounded-pill">{item.data_source.name}</CBadge>
                                </CTableDataCell>
                                <CTableDataCell className='text-center'>
                                    <CBadge color="info" shape="rounded-pill">{item.model.modelName}</CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="clearfix">
                                        <div className="float-start">
                                            <strong>{parseInt(item.progress * 100) / 100}%</strong>
                                        </div>
                                        <div className="float-end">
                                            <small className="text-medium-emphasis">{item.status}</small>
                                        </div>
                                    </div>
                                    <CProgress thin color={statusMap[item.status].color} value={item.progress} />
                                </CTableDataCell>
                                <CTableDataCell className='text-center'>
                                    {/* <div className="small text-medium-emphasis">Last login</div> */}
                                    <strong>{item.created_at.slice(0, 19)}</strong>
                                </CTableDataCell>

                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CRow>
        </>
    )
}

export default TrainingsPage