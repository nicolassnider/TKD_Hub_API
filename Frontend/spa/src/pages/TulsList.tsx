import ApiList from "../components/ApiList";

export default function TulsList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tuls</h2>
      <ApiList apiPath="/api/Tuls" titleField="name" />
    </div>
  );
}
