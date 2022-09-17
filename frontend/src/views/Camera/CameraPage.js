import {
    CCol,
    CCard,
    CRow,
    CFormSelect,
    CButton
} from '@coreui/react'
import Webcam from "react-webcam";
import React from 'react'

import axios from 'axios';
import { useId } from "react-id-generator";
import uuid from 'react-uuid';


import { useState, useEffect, useRef } from 'react';

const videoConstraints = {
    width: 426,
    height: 240,
    facingMode: "user"
};
const CameraPage = () => {

    const [isPaused, setPause] = useState(true);
    const [ws, setWs] = useState(null);
    const [streamWs, setStream] = useState(null);
    const [streamPort, setStreamPort] = useState(null);
    const [model, setModel] = useState(null);
    const client_id = uuid()

    const [cameraType, setCameraType] = useState('')
    const models = [
        'Select Model',
        { label: 'yolov5', value: 'yolov5' },
        { label: 'yolov2', value: 'yolov4' },
        { label: 'MTCnn', value: 'mtcnn' },
        { label: 'Haar-Cascade', value: 'haar' }

    ]

    // console.log(isPaused)


    function checkPause() {
        if (isPaused) {
            setPause(false)
            startCamera()
        } else {
            setPause(true)
        }
        console.log(isPaused)
    }

    function startCamera() {

        console.log('start camera', client_id)


        var postData = {
            'client_id': client_id.slice(0, 4),
            'model_id': model
        }
        // debugger

        axios.post(process.env.REACT_APP_API_BASE_URL + `/inference`, postData).then(res => {
            console.log(res)
            setStreamPort(res.data.port)
            const wsClient = new WebSocket('ws://' + process.env.REACT_APP_API_BASE_URL + ':' + res.data.port);

            wsClient.onopen = () => {
                console.log('ws opened');
                setWs(wsClient);
                // setStream(wsClient);
            };
            wsClient.onclose = () => console.log('ws closed');

        }).catch(err => {
            console.log(err)
        })

        var refreshIntervalId = setInterval(() => {
            // ws.send(getFrame());
            // ws.send(JSON.stringify({ type: 'pause', data: isPaused }));
            console.log('sending frame')
            console.log(isPaused)

            // if (!isPaused) {
            //     console.log('durmasi lazim')
            //     clearInterval(refreshIntervalId);

            // }

        }, 1000);

        console.log('camera started')
    }

    const getFrame = () => {
        const frame = webcamRef.current.getScreenshot();
        return JSON.stringify({ type: 'frame', data: frame });
    };

    const webcamRef = useRef(null);
    // const capture = React.useCallback(
    //     () => {
    //         const imageSrc = webcamRef.current.getScreenshot();
    //     },
    //     [webcamRef]
    // );

    return (
        <>


            <CRow>
                <CCol md={5}>
                    <CCard>
                        <CFormSelect
                            onChange={e => setCameraType(e.target.value)}
                            aria-label="learn_period"
                            options={[
                                'Select Camera',
                                { label: 'Webcam', value: 'webcam' },
                                { label: 'IpCam', value: 'ipcam' },
                                { label: 'USBcam', value: 'usbcam' }
                            ]}
                        />
                    </CCard>
                </CCol>
                <CCol md={5}>
                    <CCard>
                        <CFormSelect
                            onChange={e => setModel(e.target.value)}
                            aria-label="model"
                            options={models}
                        />
                    </CCard>
                </CCol>
                <CCol md={2}>
                    <CCard>
                        {/* <CButton color="primary" onClick={startCamera}>Start</CButton> */}
                        <CButton onClick={() => checkPause()}>{isPaused ? 'Resume' : 'Pause'}</CButton>
                    </CCard>
                </CCol>
            </CRow>
            <CRow>
                <Webcam
                    audio={false}
                    height={videoConstraints.height}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    width={videoConstraints.width}
                    videoConstraints={videoConstraints}
                />
            </CRow>

        </>
    )
}

export default CameraPage