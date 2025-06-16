import { useClasses } from '@/app/context/ClassContext';
import { useEffect, useState } from 'react';
import { Student } from '@/app/types/Student';

type Props = {
	classId: number;
};

const StudentsInClass: React.FC<Props> = ({ classId }) => {
	// 1. Context hooks
	const { getStudentsByClass } = useClasses();

	// 2. State hooks
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(false);

	// 3. Effects
	useEffect(() => {
		setLoading(true);
		getStudentsByClass(classId)
			.then(setStudents)
			.finally(() => setLoading(false));
		// Only depend on classId and getStudentsInClass
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [classId]);

	// 4. Functions
	// (No custom functions needed)

	// 5. Render
	if (loading) return <div>Loading students...</div>;
	if (!students.length) return <div>No students in this class.</div>;

	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">Students in Class</h3>
			<ul className="list-disc pl-5">
				{students.map((student) => (
					<li key={student.id}>
						{student.firstName} {student.lastName}
					</li>
				))}
			</ul>
		</div>
	);
};

export default StudentsInClass;
