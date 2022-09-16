import {
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react'

export const error_handling = (error) => {

  const ErrorToast = (errmessage) => (
    <CToast title="Hata">
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#ce1013"></rect>
        </svg>
        <strong className="me-auto">Hata</strong>
      </CToastHeader>
      <CToastBody>{errmessage}</CToastBody>
    </CToast>
  )

      if(error.response.status === 500){
        return(ErrorToast("Internal Server Error"))
      }
      else if(error.response.status === 400){
        return(ErrorToast("Bad Request"))
      }
      else if(error.response.status === 401){
        return(ErrorToast("Unauthorized"))
      }
      else if(error.response.status === 403){
        return(ErrorToast("Identity Known, But Forbidden"))
      }
      else if(error.response.status === 404){
        return(ErrorToast("Requested Page Not Found"))
      }
      else if(error.response.status === 405){
        return(ErrorToast("Method Not Allowed"))
      }
      else if(error.response.status === 408){
        return(ErrorToast("Timeout"))
      }
      else if(error.response.status === 429){
        return(ErrorToast("Too Many Requests"))
      }
      else if(error.response.status === 502){
        return(ErrorToast("Bad Gateway"))
      }
      else if(error.response.status === 504){
        return(ErrorToast("Gateway Timeout"))
      }
      else if(error.response.status === 505){
        return(ErrorToast("HTTP Version Not Supported"))
      }
      else if(error.response.status === 507){
        return(ErrorToast("Insufficient Storage"))
      }
      else{
        return(ErrorToast("An Error is Occurred"))
      }
 };

