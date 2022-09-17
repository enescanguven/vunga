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
  const handleItemClick = (e) => {
    console.log(e)
    axios
      .post(process.env.REACT_APP_API_BASE_URL + `/datasets`, { symbol: e })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(e)
        addToast(error_handling(error))
      })
  }
  

  return (
    <>


      <CRow>
        <CCol md={6}>
          <CCard>
            <div>

              <CFormLabel htmlFor="formFileLg">Select a file to upload</CFormLabel>

              <CInputGroup className="mb-3">
                <CFormInput type='file' onChange={(e) => setSymbol(e.target.value)} placeholder="Username" />
                <CButton onClick={() => handleItemClick(symbol)}>Upload</CButton>
              </CInputGroup>

            </div>

            <div>
      <select class="form-select" aria-label="Default select example">
              <option selected>Select a Detection Model to Train with</option>
              <option value="1">Yolov5</option>
              <option value="2">Yolov3</option>
              <option value="3">Yolo</option>
      </select>
      </div>
          </CCard>

        </CCol>
        
      </CRow>

      
    </>
  )
}
export default InfluencerPage
