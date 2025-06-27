"use client";
import React, { useEffect, useState } from "react";
import { useClasses } from "@/app/context/ClassContext";
import ClassTableRows from "@/app/components/classes/ClassTableRows";
import { AdminListPage } from "@/app/components/AdminListPage";
import EditClass from "@/app/components/classes/EditClass";
import { TrainingClass } from "@/app/types/TrainingClass";
import AddStudentToClass from "@/app/components/classes/AddStudentToClass";
import ManageAssistanceModal from "@/app/components/classes/ManageAssistanceModal";

const ClassesAdminPage = () => {
    const { classes, addClass, updateClass, fetchClasses, loading, error } = useClasses();

    const [editOpen, setEditOpen] = useState(false);
    const [editInitial, setEditInitial] = useState<TrainingClass | null>(null);
    const [addStudentsClassId, setAddStudentsClassId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);


    const handleAddStudents = (classId: number) => {
        setAddStudentsClassId(classId); // Open modal for this class
    };

    const handleManageAssistance = (classId: number) => {
        setSelectedClassId(classId);
        setModalOpen(true);
    };

    useEffect(() => {
        fetchClasses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
    }, [classes]);

    const handleEdit = (id: number) => {
        const found = classes.find(c => c.id === id) || null;
        setEditInitial(found);
        setEditOpen(true);
    };

    const handleRequestDelete = (id: number) => {
        console.log("Request delete class with id:", id);
    };

    const handleCreate = () => {
        setEditInitial(null);
        setEditOpen(true);
    };

    const handleEditSubmit = async (data: Omit<TrainingClass, "id">, id?: number) => {
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
                    <tr>
                        <th>Class Name</th>
                        <th>Instructor</th>
                        <th>Schedule</th>
                        {/* Add more headers as needed */}
                    </tr>
                }
                tableBody={
                    <ClassTableRows
                        classes={classes}
                        onEdit={handleEdit}
                        onRequestDelete={handleRequestDelete}
                        onAddStudents={handleAddStudents}
                        onManageAssistance={handleManageAssistance} // <-- Pass handler
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

export default ClassesAdminPage;
