import React from 'react'
import {
  CCol,
  CRow,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToast,
  CToaster,
  CToastHeader,
  CToastBody,
  CInputGroup,
  CFormInput,
  CButton,
  CAvatar,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import { cilPeople } from '@coreui/icons'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { error_handling } from 'src/error_handling'

const AdminPage = () => {
  const [users, setUsers] = useState([])
  const [hosts, setHosts] = useState([])
  const [toast, addToast] = useState(0)
  const [username, setInfluencer] = useState('')
  const toaster = useRef()
  const divStyle = {
    overflowY: 'scroll',
    width: '100%',
    float: 'left',
    height: '600px',
  }

  const handleItemClick = (e) => {
    console.log(e)
    axios
      .post(process.env.REACT_APP_API_BASE_URL + `/influencer/add`, { username: e })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        addToast(error_handling(error))
      })
  }
  const handleDelClick = (e) => {
    console.log(e)
    axios
      .post(process.env.REACT_APP_API_BASE_URL + `/influencer/delete`, { username: e })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        addToast(error_handling(error))
      })
  }
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL + `/influencer`)
      .then((res) => {
        console.log(res.data)
        setUsers(res.data.influencers)
      })
      .catch((error) => {
        addToast(error_handling(error))
      })
  }, [])

  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end" />

      <CInputGroup className="mb-3">
        <CFormInput onChange={(e) => setInfluencer(e.target.value)} placeholder="Username" />
        <CButton color="dark" onClick={() => handleItemClick(username)} variant="outline">
          Add
        </CButton>
      </CInputGroup>
      <CRow>
        <CCol md={12}>
          Influencer
          <div style={divStyle}>
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>
                    {' '}
                    <CIcon icon={cilPeople} />
                  </CTableHeaderCell>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Statistics</CTableHeaderCell>
                  <CTableHeaderCell>Button</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <CAvatar size="md" src={item.profileImageUrl} />
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.username}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start"></div>
                      </div>
                      <CProgress thin color="danger" value={item.followersCount} />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="danger" onClick={() => handleDelClick(item.username)}>
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default AdminPage
