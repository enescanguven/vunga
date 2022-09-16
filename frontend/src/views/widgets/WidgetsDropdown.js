import React from 'react'
import {
  CRow,
  CCol,
  CWidgetStatsC,
  CToaster,
} from '@coreui/react'

import {
  cilPeople,
  cilVector,
  cilGrain,
  cilCloud,
} from '@coreui/icons'

import CIcon from '@coreui/icons-react'
import { error_handling } from 'src/error_handling.js';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const WidgetsDropdown = () => {
  const [dashboardTopStats, setDashboardTopStats] = useState({});
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_BASE_URL + `/cortex/stats`)
      .then(res => {
        setDashboardTopStats(res.data)
      })
      .catch(error => {
        addToast(error_handling(error))
      })

  }, []);

  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      <CRow>
        <CCol sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            color="primary"
            inverse
            icon={<CIcon icon={cilGrain} height={36} />}
            text="Nodes"
            title="Nodes"
            value={dashboardTopStats.nodes}
          />

        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            color="info"
            inverse
            icon={<CIcon icon={cilVector} height={36} />}
            text="Edges"
            title="Edges"
            value={dashboardTopStats.edges}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            color="warning"
            inverse
            icon={<CIcon icon={cilPeople} height={36} />}
            text="Users"
            title="Users"
            value={dashboardTopStats.users}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            color="danger"
            inverse
            icon={<CIcon icon={cilCloud} height={36} />}
            text="Hosts"
            title="Hosts"
            value={dashboardTopStats.hosts}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default WidgetsDropdown
