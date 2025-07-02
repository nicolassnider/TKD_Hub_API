"use client";
import React, { useEffect, useState } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { AdminListPage } from "@/app/components/AdminListPage";
import EditClass from "@/app/components/classes/EditClass";
import { TrainingClass } from "@/app/types/TrainingClass";
import AddStudentToClass from "@/app/components/classes/AddStudentToClass";
import ClassTableRows from "@/app/components/classes/ClassTableRows";
import ManageAssistanceModal from "./ManageAssistanceModal";

const ClassesAdminContent = () => {
  const { classes, addClass, updateClass, fetchClasses, loading, error } =
    useClasses();

  const [editOpen, setEditOpen] = useState(false);
  const [editInitial, setEditInitial] = useState<TrainingClass | null>(null);
  const [addStudentsClassId, setAddStudentsClassId] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const handleAddStudents = (classId: number) => {
    setAddStudentsClassId(classId);
  };

  const handleManageAssistance = (classId: number) => {
    setSelectedClassId(classId);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (id: number) => {
    const found = classes.find((c) => c.id === id) || null;
    setEditInitial(found);
    setEditOpen(true);
  };

  const handleRequestDelete = (id: number) => {
    // Implement delete logic or modal here if needed
    console.log("Request delete class with id:", id);
  };

  const handleCreate = () => {
    setEditInitial(null);
    setEditOpen(true);
  };

  const handleEditSubmit = async (
    data: Omit<TrainingClass, "id">,
    id?: number
  ) => {
    if (id) {
      await updateClass(id, data);
    } else {
      await addClass(data);
    }
    setEditOpen(false);
  };

  return (
    <>
      <AdminListPage
        title="Classes Admin"
        loading={loading}
        error={error}
        onCreate={handleCreate}
        createLabel="Create Class"
        tableHead={
          <tr className="bg-neutral-100 dark:bg-neutral-800">
            <th className="px-6 py-3 text-left text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
              Class Name
            </th>
            <th className="px-6 py-3 text-left text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
              Instructor
            </th>
            <th className="px-6 py-3 text-left text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
              Location
            </th>
            <th className="px-6 py-3 text-left text-neutral-700 dark:text-neutral-200 w-full">
              Schedule
            </th>
            <th className="px-6 py-3 text-center text-neutral-700 dark:text-neutral-200 min-w-[160px] whitespace-nowrap">
              Options
            </th>
          </tr>
        }
        tableBody={
          <ClassTableRows
            classes={classes}
            onEdit={handleEdit}
            onRequestDelete={handleRequestDelete}
            onAddStudents={handleAddStudents}
            onManageAssistance={handleManageAssistance}
          />
        }
      />
      <EditClass
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={editInitial}
      />
      <AddStudentToClass
        classId={addStudentsClassId ?? 0}
        open={addStudentsClassId !== null}
        onClose={() => setAddStudentsClassId(null)}
      />
      <ManageAssistanceModal
        open={modalOpen}
        classId={selectedClassId}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ClassesAdminContent;
