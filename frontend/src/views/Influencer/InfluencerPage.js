import React from 'react'
import {
  CCol,
  CCard,
  CRow,
  CFormLabel,
  CFormInput
} from '@coreui/react'

import UploadService from "../../services/upload-files-service";

const InfluencerPage = () => {

  

  return (
    <>


      <CRow>
        <CCol md={6}>
          <CCard>
            <div>

              <CFormLabel htmlFor="formFileLg">Select a file to upload</CFormLabel>

              <CFormInput type="file" size="lg" id="formFileLg"/>

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
