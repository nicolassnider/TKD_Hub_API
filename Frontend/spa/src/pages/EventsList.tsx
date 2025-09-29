import ApiList from "components/common/ApiList";

export default function EventsList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Events</h2>
      <ApiList apiPath="/api/Events" titleField="name" />
    </div>
  );
}
