'use client';
import React from 'react';
import { useClasses } from '@/app/context/ClassContext';

type Props = {
	value: number | '';
	onChange: (id: number) => void;
	disabled?: boolean;
	className?: string;
};

const ClassSelector: React.FC<Props> = ({
	value,
	onChange,
	disabled,
	className,
}) => {
	// 1. Context hooks
	const { classes } = useClasses();

	// 2. State hooks
	// (none needed)

	// 3. Effects
	// (none needed)

	// 4. Functions
	// (none needed)

	// 5. Render
	return (
		<select
			className={className ? className : 'border rounded px-2 py-1 w-40'}
			value={value}
			onChange={(e) => onChange(Number(e.target.value))}
			disabled={disabled}
			title="Class"
			aria-label="Class"
		>
			<option value="">Select class...</option>
			{classes.map((c) => (
				<option key={c.id} value={c.id}>
					{c.name}
				</option>
			))}
		</select>
	);
};

export default ClassSelector;
