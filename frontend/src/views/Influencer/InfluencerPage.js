import React from 'react'
import {
  CCol,
  CCard,
  CRow,
  CFormLabel,
  CFormInput,
  CInputGroup,
  CButton
} from '@coreui/react'
import axios from 'axios';
import { useState, useEffect, useRef } from 'react'

const InfluencerPage = () => {
  const [symbol, setSymbol] = useState('')
  const [file, setFile] = useState()

  const handleItemClick = (e) => {
    console.log(e.target.files[0])

    setFile(e.target.files[0])
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    console.log(e.target.files[0].name)
    formData.append("fileName", e.target.files[0].name);



    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(process.env.REACT_APP_API_BASE_URL + `/datasets`, formData, config)
      .then((response) => {
        console.log(response.data);
      }).catch((error) => {
      })
  }


  return (
    <>


      <CRow>
        <CCol md={6}>
          <CRow>
            <div>


              <form>
                <input onChange={handleItemClick} type="file" />
              </form>

            </div>

            <div>
              <select class="form-select" aria-label="Default select example">
                <option selected>Select a Detection Model to Train with</option>
                <option value="1">Yolov5</option>
                <option value="2">Yolov3</option>
                <option value="3">Yolo</option>
              </select>
            </div>
          </CRow>

        </CCol>

      </CRow>


    </>
  )
}
export default InfluencerPage
