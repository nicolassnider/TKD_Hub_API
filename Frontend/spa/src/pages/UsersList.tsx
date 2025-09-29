import ApiList from "../components/common/ApiList";

export default function UsersList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <ApiList apiPath="/api/Users" titleField="fullName" />
    </div>
  );
}
