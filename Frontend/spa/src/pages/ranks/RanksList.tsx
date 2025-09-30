import ApiList from "../../components/common/ApiList";

export default function RanksList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ranks</h2>
      <ApiList apiPath="/api/Ranks" titleField="name" />
    </div>
  );
}
