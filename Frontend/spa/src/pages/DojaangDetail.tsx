import React from 'react'
import ApiDetail from '../components/ApiDetail'
import { useParams } from 'react-router-dom'

export default function DojaangDetail(){
  const { id } = useParams()
  return <ApiDetail apiPath="/api/Dojaangs" id={id} />
}
