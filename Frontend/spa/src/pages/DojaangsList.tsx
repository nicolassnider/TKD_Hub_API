import ApiList from '../components/ApiList'

export default function DojaangsList(){
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dojaangs</h2>
      <ApiList apiPath="/api/Dojaangs" titleField="name"/>
    </div>
  )
}
