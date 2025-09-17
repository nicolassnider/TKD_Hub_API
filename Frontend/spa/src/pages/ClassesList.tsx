import ApiList from '../components/ApiList'
export default function ClassesList(){ return <div><h2 className="text-2xl font-bold mb-4">Classes</h2><ApiList apiPath="/api/TrainingClasses" titleField="name"/></div> }
