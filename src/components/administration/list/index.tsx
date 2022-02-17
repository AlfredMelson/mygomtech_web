import { Divider, ListItemButton, Stack } from '@mui/material'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useRef, useState } from 'react'
import Modal from 'react-modal'
import useUpdateEmployee from '../../../hooks/useUpdateEmployee'
import { IEmployee } from '../../../services/getEmployees'
import { LoginButtonSx, UpdateEmailButtonSx } from '../../mui/Button.style'

interface IUpdateModal {
  emplId: string
  emplName: string
  emplRole: string
}

function UpdateModal({ emplId, emplName, emplRole }: IUpdateModal) {
  const [showModal, setShowModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')

  const callUpdate = useUpdateEmployee({ emplId, emplName, emplRole, emplEmail: newEmail })

  // error reference
  const errorReference = useRef<HTMLParagraphElement | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // handle error message display transition
  const [errorAlert, setErrorAlert] = useState<boolean>(false)

  const handleEmplUpdate = async event => {
    event.preventDefault()

    try {
      callUpdate()

      window.location.reload()

      // open error alert if there is a caught error
    } catch (error) {
      setErrorAlert(true)

      // handle no response from the server
      if (!error?.response) {
        setErrorMessage('No Server Response')

        // handle invalid syntax
      } else if (error.response?.status === 400) {
        setErrorMessage('Missing Username or Password')

        // handle invalid syntax
      } else if (error.response?.status === 401) {
        setErrorMessage('Unauthorized Creditentials')

        // catch-all-other-errors
      } else {
        setErrorMessage('Login Failed')
      }
      errorReference.current.focus()
    }
  }

  // only allow setting of new emial if it is a valid email address

  return (
    <>
      <Collapse in={errorAlert}>
        <Alert sx={{ mb: 2 }} variant='filled' severity='error' ref={errorReference}>
          {errorMessage}
        </Alert>
      </Collapse>
      <UpdateEmailButtonSx sx={{ ml: 'auto', mr: '10px' }} onClick={() => setShowModal(true)}>
        Update Email
      </UpdateEmailButtonSx>
      <Modal
        className='modal'
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel='Example Modal'>
        <h1>Update Email</h1>
        <input
          placeholder='New Email'
          className='input'
          value={newEmail}
          onChange={event => setNewEmail(event.target.value)}
        />
        <Stack
          direction='row'
          justifyContent='space-evenly'
          alignItems='center'
          spacing={2}
          sx={{ my: '20px' }}>
          <LoginButtonSx onClick={handleEmplUpdate}>Change</LoginButtonSx>
          <LoginButtonSx
            onClick={() => {
              setShowModal(false)
            }}>
            Cancel
          </LoginButtonSx>
        </Stack>
      </Modal>
    </>
  )
}

interface IEmployeeEntry {
  employees: Array<IEmployee>
}

export default function EmployeeEntry({ employees }: IEmployeeEntry) {
  const [selectedIndex, setSelectedIndex] = useState(1)

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index)
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {employees.map(empl => (
        <>
          <ListItemButton
            key={empl.id}
            selected={selectedIndex === parseInt(empl.id)}
            onClick={event => handleListItemClick(event, 0)}>
            <ListItemAvatar>
              <Avatar>{empl.name.substring(0, 2)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={empl.name} secondary={empl.email} />
            <UpdateModal emplId={empl.id} emplName={empl.name} emplRole={empl.role} />
          </ListItemButton>
          <Divider component='li' />
        </>
      ))}
    </List>
  )
}

// export default function List({ employees }: IList) {
//   return (
//     <ul className='list'>
//       {employees.map(empl => (
//         <li className='item' key={empl.name}>
//           <ItemIcon name={empl.name} />
//           <div>
//             <div className='title'>{empl.name}</div>
//             <div className='description'>{empl.email}</div>
//           </div>
//           <UpdateModal emplId={empl.id} emplName={empl.name} emplRole={empl.role} />
//         </li>
//       ))}
//     </ul>
//   )
// }