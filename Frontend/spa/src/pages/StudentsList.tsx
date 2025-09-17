import ApiTable from 'components/ApiTable'
import { useApiItems } from 'components/useApiItems'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

export default function StudentsList(){
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <StudentsTable />
    </div>
  )
}

function StudentsTable(){
  const { items, loading, error, reload } = useApiItems('/api/Students')
  const navigate = useNavigate()
  const cols = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'fullName', label: 'Name', render: (r: any) => `${r.firstName} ${r.lastName}`, sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' }
  ]
  if (loading) return <div>Loading table…</div>
  if (error) return <div className="text-red-500">{error}</div>
  return (
    <div>
      <div className="mb-3"><Button variant="outlined" size="small" onClick={() => reload()}>Refresh</Button></div>
      <ApiTable rows={items} columns={cols} onRowClick={(r) => navigate(`/students/${r.id}`)} defaultPageSize={10} pageSizeOptions={[10,25,50]} />
    </div>
  )
}
