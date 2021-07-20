import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useMutation } from '@apollo/client'
import { CREATE_USER_QUERY } from '../gql/user'

const SignIn = ({ setUserId }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [createUser] = useMutation(CREATE_USER_QUERY, {
    onCompleted(data) {
      const { createUser } = data
      sessionStorage.setItem('userId', `${createUser.id}`)
      sessionStorage.setItem('userFirstName', `${createUser.firstName}`)
      sessionStorage.setItem('userFirstName', `${createUser.lastName}`)
      setUserId(`${createUser.id}`)
    },
  })

  const handleSignIn = async () => {
    await createUser({ variables: { input: { firstName, lastName } } })
  }

  return (
    <div className='card' style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ margin: '16px' }}>Welcome</h2>
        <span className="p-float-label" style={{ margin: '16px' }}>
          <InputText id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <label htmlFor="firstName">First name</label>
        </span>
          <span className="p-float-label" style={{ margin: '16px' }}>
          <InputText id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
          <label htmlFor="firstName">Last name</label>
        </span>
        <Button label="Sign in" className="p-button-rounded" style={{ margin: '16px' }} onClick={handleSignIn} />
      </div>
    </div>
  )
}

export default SignIn