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
import { Camera } from "react-camera-pro";

import { useState, useEffect, useRef } from 'react';



const CameraPage = () => {

    const camera = useRef(null);
    const [image, setImage] = useState(null);


    const [isPaused, setPause] = useState(true);
    const [ws, setWs] = useState(null);
    const [streamWs, setStream] = useState(null);
    const [streamPort, setStreamPort] = useState(null);
    const [client_id] = useId();
    const [model, setModel] = useState(null);
    const [webcamRef2, setWebcamRef] = useState(null);

    // const [cameraType, setCameraType] = useRef(null)

    const models = [
        'Select Model',
        { label: 'yolov5', value: 'yolov5' },
        { label: 'yolov2', value: 'yolov4' },
        { label: 'MTCnn', value: 'mtcnn' },
        { label: 'Haar-Cascade', value: 'haar' }

    ]

    function startCamera() {
        setPause(!isPaused)
        var postData = {
            'client_id': client_id,
            'model_id': model
        }

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

        setInterval(() => {
            ws.send(getFrame());
            ws.send(JSON.stringify({ type: 'pause', data: isPaused }));

        }, 1000);
        console.log('camera started')
    }

    const getFrame = () => {
        // const frame = webcamRef.current.getScreenshot();
        return JSON.stringify({ type: 'frame', data: frame });
    };




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
                        <CButton onClick={() => startCamera()}>{isPaused ? 'Resume' : 'Pause'}</CButton>
                    </CCard>
                </CCol>
            </CRow>
            <CRow>
                <Camera ref={camera} />
                {/* <Webcam
                    audio={false}
                    // height={videoConstraints.height}
                    height={720}
                    ref={webcamRef2}
                    screenshotFormat="image/png"
                    width={1080}
                    // {videoConstraints.width}
                    videoConstraints={videoConstraints}
                /> */}
            </CRow>

        </>
    )
}

export default CameraPage