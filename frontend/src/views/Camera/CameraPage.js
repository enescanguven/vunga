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
import { Celebration } from '@mui/icons-material';

const videoConstraints = {
    width: 426,
    height: 240,
    facingMode: "user"
};
const CameraPage = () => {

    const [isPaused, setPause] = useState(false);
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


    function startCamera() {

        // if (isPaused)

        //     console.log('start camera', client_id)


        var postData = {
            'client_id': client_id.slice(0, 4),
            'model_id': model
        }

        function isOpen(ws) { return ws.readyState === ws.OPEN }

        axios.post(process.env.REACT_APP_API_BASE_URL + `/inference`, postData).then(res => {
            console.log(res.data.port)
            console.log(process.env.REACT_APP_WS_BASE_URL)
            // const wsClient = new WebSocket(process.env.REACT_APP_WS_BASE_URL + ":3131");
            const wsClient = new WebSocket(process.env.REACT_APP_WS_BASE_URL + `:${res.data.port}`)

            // setWs(new WebSocket(process.env.REACT_APP_WS_BASE_URL + `:${res.data.port}`))
            console.log(process.env.REACT_APP_WS_BASE_URL + `:${res.data.port}`)

            var refreshIntervalId = setInterval(() => {
                console.log('refreshing');
                if (isOpen(wsClient)) {
                    console.log('sending data')
                    wsClient.send(getFrame());



                }
                else {
                    console.log('reconnecting')
                    // console.log('ws', process.env.REACT_APP_WS_BASE_URL + `:${res.data.port}`)
                    // const wsClient = new WebSocket(process.env.REACT_APP_WS_BASE_URL + ":3131");
                    const wsClient = new WebSocket(process.env.REACT_APP_WS_BASE_URL + `:${res.data.port}`)
                    wsClient.onopen = () => {
                        console.log('wsClient connected')
                        wsClient.send(getFrame());
                        wsClient.onmessage = (event) => {
                            console.log(event.data)
                        }
                    }


                }
            }, 1000);
            console.log('wsClient cikti')


            // var refreshIntervalnew = setInterval(() => {
            //     wsClient.send(getFrame());
            //     wsClient.onmessage = (event) => {
            //         console.log(event.data)
            //     }

            //     console.log('sending frame', res.data.port)
            // }, 1000);

            // wsClient.onopen = () => {
            //     console.log('ws opened');
            // };
            // wsClient.onclose = () => console.log('ws closed');

            // // while (!isOpen(wsClient)) {
            // //     console.log('waiting')
            // //     const wsClient = new WebSocket(process.env.REACT_APP_WS_BASE_URL + "3131");

            // // }


            // // wsClient.onclose = () => console.log('ws closed');


            // setStream(new WebSocket(`ws://localhost:${streamPort}`))

        }).catch(err => {
            console.log(err)
        })

        // console.log('start camera')
        // const wsClient = new WebSocket('wss://10.0.10.109:3131');
        // wsClient.onopen = () => {
        //     console.log('ws opened');
        // };
        // wsClient.onclose = () => console.log('ws closed');


        // var refreshIntervalId = setInterval(() => {
        //     wsClient.send(getFrame());
        //     wsClient.onmessage = (event) => {
        //         console.log(event.data)
        //     }
        //     // wsClient.send(JSON.stringify({ type: 'pause', data: getFrame().data }));
        //     console.log('sending frame')

        // }, 1000);

        // console.log('camera started')
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
                        <CButton color="primary" onClick={startCamera}>Start</CButton>
                        {/* <CButton onClick={() => setPause(!isPaused)}>{isPaused ? 'Resume' : 'Pause'}</CButton> */}
                    </CCard>
                </CCol>
            </CRow>
            <CRow>
                <Webcam
                    audio={false}
                    height={720}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    width={1080}
                    videoConstraints={videoConstraints}
                />
            </CRow>

        </>
    )
}

export default CameraPage