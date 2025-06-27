'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRoles } from '../../context/RoleContext';
import { useRouter } from 'next/navigation';
import { AdminListPage } from '@/app/components/AdminListPage';
import { useUsers } from '@/app/context/UserContext';
import EditUser from '@/app/components/users/EditUser';
import UserTableRows from '@/app/components/users/UserTableRows';
import { User } from '@/app/types/User';
import { UserRole } from '@/app/types/UserRole';

const allowedRoles: UserRole[] = ['Admin'];

export default function UsersAdmin() {
    const { role, roleLoading } = useRoles();
    const router = useRouter();

    const { users: usersRaw = [], loading, error, fetchUsers } = useUsers();

    const users = useMemo(() => {
        if (Array.isArray(usersRaw)) return usersRaw;
        if (
            typeof usersRaw === "object" &&
            usersRaw !== null &&
            "data" in usersRaw &&
            Array.isArray((usersRaw as { data: unknown }).data)
        ) {
            return (usersRaw as { data: User[] }).data;
        }
        return [];
    }, [usersRaw]);

    const [editId, setEditId] = useState<number | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    // Role protection
    useEffect(() => {
        // Only check after roleLoading is false and role is set
        if (roleLoading) return;
        if (!role.some(r => allowedRoles.includes(r))) {
            router.replace('/forbidden');
        }
    }, [role, roleLoading, router]);

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleEdit(id: number) {
        setEditId(id);
    }
    function handleEditClose(refreshList?: boolean) {
        setEditId(null);
        if (refreshList) fetchUsers();
    }
    function handleCreate() {
        setShowCreate(true);
    }
    function handleCreateClose(refreshList?: boolean) {
        setShowCreate(false);
        if (refreshList) fetchUsers();
    }

    if (roleLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AdminListPage
            title="Users Administration"
            loading={loading}
            error={error}
            filters={null}
            onCreate={handleCreate}
            createLabel="Add User"
            tableHead={
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Options</th>
                </tr>
            }
            tableBody={
                <UserTableRows
                    users={users}
                    onEdit={handleEdit}
                    onDeleted={fetchUsers}
                />
            }
            modals={
                <>
                    {showCreate && <EditUser onClose={handleCreateClose} />}
                    {editId !== null && <EditUser userId={editId} onClose={handleEditClose} />}
                </>
            }
        />
    );
}
