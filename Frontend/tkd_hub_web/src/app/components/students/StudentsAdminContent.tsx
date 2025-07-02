"use client";
import { useEffect, useMemo, useState } from "react";
import { useDojaangs } from "@/app/context/DojaangContext";
import StudentTableRows from "@/app/components/students/StudentTableRows";
import EditStudent from "@/app/components/students/EditStudent";
import { AdminListPage } from "@/app/components/AdminListPage";
import { Student } from "@/app/types/Student";
import { useStudents } from "@/app/context/StudentContext";
import { GenericSelector } from "@/app/components/common/selectors/GenericSelector";

export default function StudentsAdminContent() {
  const {
    students: studentsRaw = [],
    loading,
    error,
    fetchStudents,
  } = useStudents();
  const { dojaangs, loading: dojaangsLoading, fetchDojaangs } = useDojaangs();

  const students: Student[] = useMemo(() => {
    if (Array.isArray(studentsRaw)) {
      return studentsRaw;
    }
    if (
      typeof studentsRaw === "object" &&
      studentsRaw !== null &&
      "data" in studentsRaw &&
      Array.isArray((studentsRaw as { data: unknown }).data)
    ) {
      return (studentsRaw as { data: Student[] }).data;
    }
    if (
      typeof studentsRaw === "object" &&
      studentsRaw !== null &&
      "data" in studentsRaw &&
      typeof (studentsRaw as { data: unknown }).data === "object" &&
      (studentsRaw as { data: { data?: unknown } }).data !== null &&
      "data" in (studentsRaw as { data: { data?: unknown } }).data &&
      Array.isArray((studentsRaw as { data: { data: unknown[] } }).data.data)
    ) {
      return (studentsRaw as { data: { data: Student[] } }).data.data;
    }
    return [];
  }, [studentsRaw]);

  const [editId, setEditId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filterDojaangId, setFilterDojaangId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filteredStudents = useMemo(
    () =>
      students.filter((s) => {
        const dojaangMatch =
          filterDojaangId === null ? true : s.dojaangId === filterDojaangId;
        const activeMatch = showAll ? true : s.isActive;
        return dojaangMatch && activeMatch;
      }),
    [students, filterDojaangId, showAll]
  );

  function handleEdit(id: number) {
    setEditId(id);
  }
  function handleEditClose(refreshList?: boolean) {
    setEditId(null);
    if (refreshList) fetchStudents();
  }

  function handleCreate() {
    setShowCreate(true);
  }

  function handleCreateClose(refreshList?: boolean) {
    setShowCreate(false);
    if (refreshList) fetchStudents();
  }

  useEffect(() => {
    fetchStudents();
    fetchDojaangs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // No-op, but dependencies are now correct
  }, [studentsRaw, students, filteredStudents, filterDojaangId, showAll]);

  return (
    <>
      <div className="flex items-center gap-4 mb-0 pl-4">
        <label
          htmlFor="showAllSwitch"
          className="font-medium text-neutral-200 flex items-center gap-4 cursor-pointer"
        >
          <span className="mr-4">Show inactive students</span>
          <span className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in mr-2">
            <input
              id="showAllSwitch"
              type="checkbox"
              checked={showAll}
              onChange={() => setShowAll((v) => !v)}
              className="sr-only peer"
            />
            <span className="block w-12 h-6 bg-neutral-700 rounded-full peer-checked:bg-blue-600 transition"></span>
            <span className="dot absolute left-1 top-1 bg-neutral-200 w-4 h-4 rounded-full transition peer-checked:translate-x-6 tkd-switch-dot"></span>
          </span>
          <span className="ml-2 text-sm text-neutral-400">
            {showAll ? "All" : "Active"}
          </span>
        </label>
      </div>
      <AdminListPage
        title="Students Administration"
        loading={loading}
        error={error}
        filters={
          <div className="flex items-center gap-4">
            <GenericSelector
              items={dojaangs}
              value={filterDojaangId}
              onChange={(id) => setFilterDojaangId(id)}
              getLabel={(d) => d.name}
              getId={(d) => d.id}
              disabled={loading || dojaangsLoading}
              label="Dojaang"
              placeholder="All dojaangs"
              className="bg-neutral-900 text-neutral-100 border-neutral-700 placeholder:text-neutral-400"
            />
          </div>
        }
        onCreate={handleCreate}
        createLabel="Create"
        tableHead={
          <tr className="bg-neutral-800">
            <th className="px-4 py-2 text-left font-semibold text-neutral-100">
              ID
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-100">
              Name
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-100">
              Email
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-100">
              Options
            </th>
          </tr>
        }
        tableBody={
          <StudentTableRows
            students={filteredStudents}
            onEdit={handleEdit}
            onDeleted={fetchStudents}
            onReactivated={fetchStudents}
            isActiveFilter={showAll ? null : true}
          />
        }
        modals={
          <>
            {showCreate && <EditStudent onClose={handleCreateClose} />}
            {editId !== null && (
              <EditStudent studentId={editId} onClose={handleEditClose} />
            )}
          </>
        }
      />
    </>
  );
}
