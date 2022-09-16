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
  CModal,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CModalHeader,
  CPopover,
  CTooltip,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
// import Chart from 'react-apexcharts'

import { cilBuilding, cilPeople } from '@coreui/icons'
import logo from './../../assets/images/react.jpg'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { error_handling } from 'src/error_handling'

const StockPage = () => {
  const [toast, addToast] = useState(0)
  const [symbol, setSymbol] = useState('')
  const [stocks, setStocks] = useState([])
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
  const handleChartClick = (e) => {
    console.log(e)
    axios
      .post(process.env.REACT_APP_API_BASE_URL + `/stock_info/detail`, { symbol: e })
      .then((res) => {
        console.log(res.data.xaxis)
        setStockData(res.data)
        setVisible(true)
      })
      .catch((error) => {
        addToast(error_handling(error))
      })
  }
  const handleDelClick = (e) => {
    console.log(e)
    axios
      .post(process.env.REACT_APP_API_BASE_URL + `/stock_info/delete`, { symbol: e })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        addToast(error_handling(error))
      })
  }
  // TODO: Fix displaying chart when button is clicked
  // const handleDetailClick = (e) => {
  //   console.log(e)
  //   axios
  //     .post(process.env.REACT_APP_API_BASE_URL + `/stock_info/detail`, { symbol: e })
  //     .then((res) => {
  //       console.log(res)
  //       setStockData(res.data)
  //       setVisible(true)
  //     })
  //     .catch((error) => {
  //       addToast(error_handling(error))
  //     })
  // }

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL + `/stock_info`)
      .then((res) => {
        console.log(res.data)
        setStocks(res.data.stocks)
      })
      .catch((error) => {
        addToast(error_handling(error))
      })
  }, [])
  const options = {
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: 'Historical Stock Price',
      align: 'center',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  }
  const series = [
    {
      data: stockData,
    },
  ]

  return (
    <>
      {/* <CToaster ref={toaster} push={toast} placement="top-end" />

      <CInputGroup className="mb-3">
        <CFormInput onChange={(e) => setSymbol(e.target.value)} placeholder="Username" />
        <CButton onClick={() => handleItemClick(symbol)}>Ara</CButton>
      </CInputGroup> */}
      <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>NLP Pipeline Output</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <div id="chart">
              <Chart options={options} series={series} type="candlestick" height={350} />
            </div>
          </CRow>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <CRow>
        <CCol md={12}>
          <strong> Stocks</strong>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>
                  {' '}
                  <CIcon icon={cilBuilding} />
                </CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Open</CTableHeaderCell>
                <CTableHeaderCell>High</CTableHeaderCell>
                <CTableHeaderCell>Low</CTableHeaderCell>
                <CTableHeaderCell>Close</CTableHeaderCell>
                <CTableHeaderCell>Volume</CTableHeaderCell>
                {/* <CTableHeaderCell>Chart</CTableHeaderCell> */}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {stocks.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={index}>
                  <CTableDataCell>
                    <CAvatar size="md" src={item.logo_url} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.shortName}</div>
                  </CTableDataCell>
                  <CTableDataCell>{item.open}</CTableDataCell>
                  <CTableDataCell>{item.high}</CTableDataCell>
                  <CTableDataCell>{item.low}</CTableDataCell>
                  <CTableDataCell>{item.close}</CTableDataCell>
                  <CTableDataCell>{item.volume}</CTableDataCell>
                  {/* <CTableDataCell>
                    {' '}
                    <CButton
                      onClick={() => handleChartClick(item.symbol)}
                      variant="ghost"
                      color="dark"
                    >
                      Show Chart
                    </CButton>
                  </CTableDataCell> */}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </>
  )
}

export default StockPage
