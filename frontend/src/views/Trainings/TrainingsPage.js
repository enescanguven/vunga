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

import {
    cilMediaPlay,
    cilReload
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const TrainingsPage = () => {
    const [trainings, setTrainings] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModels] = useState('');
    const [selectedDataset, setSelectedDataset] = useState('');

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_BASE_URL + `/trainings`)
            .then(res => {
                setTrainings(res.data.trainings);
            })
            .catch(err => {
                console.log(err);
            })
        axios.get(process.env.REACT_APP_API_BASE_URL + `/datasets`)
            .then(res => {
                console.log(res.data.datasets);
                let datasetOptions = ['choose a dataset'];
                res.data.datasets.map((item) => {
                    console.log(item);
                    datasetOptions.push({ label: item.name, value: item.location })
                })
                setDatasets(datasetOptions);
            })
            .catch(err => {
                console.log(err);
            })
        const modelsOptions = [
            'choose a model',
            { label: 'yolo v5 nano', value: 'yolov5n.yaml', },
            { label: 'yolo v5 small', value: 'yolov5s.yaml' }
        ]
        setModels(modelsOptions);
        // axios.get(process.env.REACT_APP_API_BASE_URL + `/models`)
        //     .then(res => {
        //         console.log(res.data.models);
        //         let modelsOptions = ['choose a models'];
        //         res.data.models.map((item) => {
        //             console.log(item);
        //             modelsOptions.push({ label: item.name, value: item.name })
        //         })
        //         setModels(modelsOptions)
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })


    }, [])



    function submitTraining() {
        let data = { "dataset": selectedDataset, "model": selectedModel }
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
                    <strong>Train Your Dataset</strong> <small></small>
                </CCardHeader>
                <CCardBody>
                    <p className="text-medium-emphasis small">
                        You can choose your dataset and your model to train your dataset.
                    </p>
                    <CRow>
                        <CCol md='5'>
                            <CFormSelect
                                onChange={e => setSelectedDataset(e.target.value)}
                                aria-label="data_sources"
                                options={datasets}
                            />
                        </CCol>
                        <CCol md='5'>
                            <CFormSelect
                                onChange={e => setSelectedModels(e.target.value)}
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

                                <CTableDataCell className='text-center'>
                                    {item.model}
                                </CTableDataCell>
                                <CTableDataCell className='text-center'>
                                    <CBadge color="success" shape="rounded-pill">{item.dataset}</CBadge>
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
                                </CTableDataCell>
                                <CTableDataCell className='text-center'>
                                    {/* <div className="small text-medium-emphasis">Last login</div> */}
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