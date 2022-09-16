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
  CInputGroup,
  CFormInput,
  CButton,
  CAvatar,
  CFormSelect,
  CDateRangePicker,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import { cilBuilding, cilPeople } from '@coreui/icons'
import logo from './../../assets/images/react.jpg'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { error_handling } from 'src/error_handling'

const metricPage = () => {
  const [toast, addToast] = useState(0)
  const [symbol, setSymbol] = useState('')
  const [users, setUsers] = useState([])
  const [stockData, setStockData] = useState([])
  const [visible, setVisible] = useState(false)
  const toaster = useRef()

  const handleItemClick = (e) => {
    console.log(e)
    axios
      .post(process.env.REACT_APP_API_BASE_URL + `/stock_info/add`, { symbol: e })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(e)
        addToast(error_handling(error))
      })
  }

  const handleDetailClick = (e) => {
    console.log(e)
    axios
      .post(process.env.REACT_APP_API_BASE_URL + `/stock_info/detail`, { symbol: e })
      .then((res) => {
        console.log(res)
        setStockData(res.data)
        setVisible(true)
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
      <CFormSelect aria-label="Default select example">
        <option>Please Select Influencer</option>
        {users.map((user) => (
          <option value={user.displayname}>{user.displayname}</option>
        ))}
      </CFormSelect>
    </>
  )
}

export default metricPage
