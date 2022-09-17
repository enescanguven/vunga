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
  CFormSwitch
} from '@coreui/react'
import axios from 'axios';
import { useState, useEffect, useRef } from 'react'

const DatasetsPage = () => {
  const [symbol, setSymbol] = useState('')
  const [file, setFile] = useState()
  const [datasets, setDatasets] = useState([])

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
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_BASE_URL + `/datasets`)
      .then((response) => {
        console.log(response.data.datasets);
        setDatasets(response.data.datasets)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <CCard hidden={datasets.length === 0} className="mb-4">
        <CCardHeader>
          <strong>Eklenen Kaynaklar</strong> <small></small>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Kaynak Adı</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Kaynak Parametreleri</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {datasets.map((item, i) =>
                    <CTableRow>
                      <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                      <CTableDataCell><b>{item.name}</b></CTableDataCell>
                      <CTableDataCell>
                        <code>{JSON.stringify(item.location)}</code>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

            </CCol>
          </CRow>
          <CRow>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Train Your Dataset</strong> <small></small>
        </CCardHeader>
        <CCardBody>
          <p className="text-medium-emphasis small">
            You can choose augmented data to train your model with.
          </p>
          <CRow>
            <CCol md='5'>
              <form>
                <input onChange={handleItemClick} type="file" />
              </form>
            </CCol>
            <CCol md='5'>
              <CFormSwitch label="Rotate" id="formSwitchCheckDefault" />
              <CFormSwitch label="Mirror" id="formSwitchCheckDefault" />
              <CFormSwitch label="Gaussian Filter" id="formSwitchCheckDefault" />

              {/* <select class="form-select" aria-label="Default select example">
                <option selected>Select a Augmentation Model to Train with</option>
                
                <option value="1">Yolov5</option>
                <option value="2">Yolov3</option>
                <option value="3">Yolo</option>
              </select> */}
            </CCol>
            {/* <CCol md='5'>
              <CFormSelect
                onChange={e => setModels(e.target.value)}
                aria-label="learning_rules"
                options={models}
              />
            </CCol> */}
            {/* <CCol>
              <CButton onClick={submitTraining} style={{ color: 'white' }} className='btn btn-success'><CIcon icon={cilMediaPlay} /> Eğitimi Başlat</CButton>
            </CCol> */}

          </CRow>
        </CCardBody>

      </CCard>
      {/* <CRow>
        <CCol md={6}>
          <CRow>
            <CCol>


              <form>
                <input onChange={handleItemClick} type="file" />
              </form>

            </CCol>

            <CCol>
              <select class="form-select" aria-label="Default select example">
                <option selected>Select a Detection Model to Train with</option>
                <option value="1">Yolov5</option>
                <option value="2">Yolov3</option>
                <option value="3">Yolo</option>
              </select>
            </CCol>
          </CRow>

        </CCol>

      </CRow> */}


    </>
  )
}
export default DatasetsPage
