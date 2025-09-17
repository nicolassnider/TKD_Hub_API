import ApiList from '../components/ApiList'

export default function PromotionsList(){
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Promotions</h2>
      <ApiList apiPath="/api/Promotions" titleField="title"/>
    </div>
  )
}
