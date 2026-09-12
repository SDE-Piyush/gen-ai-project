import { useAuth } from "../hooks/useAuth";
import React, { Children } from 'react'
import { Navigate } from "react-router";
import RunningLoader from "../../interview/pages/components/RunningLoader";

const Protected = ({children}) => {

    const{loading, user} = useAuth()

    if(loading) {
        return(<main> <RunningLoader /> </main>)
    }

    if(!user) {
        return <Navigate to={'/login'} />
    }

  return  children
}

export default Protected