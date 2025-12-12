import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'

function useGetUserContext() {
  return useContext(UserContext)
}

export default useGetUserContext