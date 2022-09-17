import React from 'react'

const AdminPage = React.lazy(() => import('./views/Admin/AdminPage'))
const InfluencerPage = React.lazy(() => import('./views/Influencer/InfluencerPage'))
const StockPage = React.lazy(() => import('./views/Stock/StockPage'))
const metricPage = React.lazy(() => import('./views/Metrics/metricPage'))
const CameraPage = React.lazy(() => import('./views/Camera/CameraPage'))
const TrainingsPage = React.lazy(() => import('./views/Trainings/TrainingsPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/camera', name: 'Camera', element: CameraPage },
  { path: '/trainings', name: 'Trainings', element: TrainingsPage },
  { path: '/admin', name: 'Admin', element: AdminPage },
  { path: '/stock', name: 'Stock', element: StockPage },
  { path: '/influencer', name: 'Influencer', element: InfluencerPage },
  { path: '/influencer/metrics', name: 'Metrics', element: metricPage },
]

export default routes
