import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { AxiosResponse } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axiosCustom'
import { useAuth, useLoginInput } from '../../hooks'
import { API, LOCAL } from '../../utils'
import { ShieldIcon } from '../icons'
import { LoginButtonSx } from '../mui/Button.style'

export default function LoginCard() {
  const navigate = useNavigate()

  // hook up admin authentication state
  const { setAuth } = useAuth()

  // error reference
  const errorReference = useRef<HTMLParagraphElement | null>(null)

  // migrated useState to useInput for localStorage persistence
  const [adminUsername, resetUser, userAttributions] = useLoginInput(LOCAL.User, '')
  const [adminPassword, setAdminPassword] = useState<string>('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // handle error message display transition
  const [errorAlert, setErrorAlert] = useState<boolean>(false)

  useEffect(() => {
    // empty any error message
    setErrorMessage('')

    // reset alert when either the username or password state changes
    setErrorAlert(false)
  }, [adminUsername, adminPassword])

  const handleFormSubmit = async event => {
    event.preventDefault()

    try {
      const response: AxiosResponse = await axios.post(
        API.Login,
        JSON.stringify({ adminUsername, adminPassword }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      if (response.status === 200) {
        const accessToken = response?.data?.accessToken
        // provide the username, password and accessToken to the auth provider
        setAuth({ adminUsername, adminPassword, accessToken })

        // reset the username and password fields
        resetUser()
        setAdminPassword('')

        // push user to dashboard page
        navigate('/dashboard', { replace: true })
      }

      // open error alert if there is a caught error
    } catch (error) {
      setErrorAlert(true)
      setErrorMessage('Login Failed')

      // handle no response from the server
      // if (!error?.response) {
      //   setErrorMessage('No Server Response')

      //   // handle invalid syntax
      // } else if (error.response?.status === 400) {
      //   setErrorMessage('Missing Username or Password')

      //   // handle invalid syntax
      // } else if (error.response?.status === 401) {
      //   setErrorMessage('Unauthorized Creditentials')

      //   // catch-all-other-errors
      // } else {
      //   setErrorMessage('Login Failed')
      // }
      errorReference.current.focus()
    }
  }

  return (
    <Card raised>
      <CardHeader
        title={
          <Collapse in={errorAlert}>
            <Alert sx={{ m: '4px' }} variant='filled' severity='error' ref={errorReference}>
              {errorMessage}
            </Alert>
          </Collapse>
        }
      />
      <Box sx={{ mx: '30px' }}>
        <div className='login-card-header' />
      </Box>
      <CardContent sx={{ m: '10px', minWidth: '320px' }}>
        <form>
          <Typography variant='body1' color='text.primary' gutterBottom>
            Username
          </Typography>
          <TextField autoFocus fullWidth type='text' id='username' required {...userAttributions} />
          <Typography variant='body1' color='text.primary' gutterBottom sx={{ mt: '20px' }}>
            Password
          </Typography>
          <TextField
            fullWidth
            type='password'
            id='password'
            value={adminPassword}
            required
            onChange={event => setAdminPassword(event.target.value)}
          />
          <Stack direction='row' justifyContent='center' alignItems='center' sx={{ mt: '30px' }}>
            <LoginButtonSx
              type='submit'
              onClick={handleFormSubmit}
              variant='contained'
              startIcon={<ShieldIcon />}>
              Login
            </LoginButtonSx>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
