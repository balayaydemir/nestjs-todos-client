import React, { useState } from 'react'
import SignIn from './components/SignIn'
import Home from './components/Home'


const App = () => {
  const [userId, setUserId] = useState(sessionStorage.getItem('userId'))

  return (
    <div className="App" style={{ padding: '24px', width: '100vw', height: '100vh' }}>
      {!userId ? <SignIn setUserId={setUserId} /> : <Home userId={userId} />}
    </div>
  );
}

export default App
