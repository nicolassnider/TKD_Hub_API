import React from 'react';
import { TrainingClass } from '../../types/TrainingClass';
import { daysOfWeek } from '@/app/const/daysOfWeek';

type CoachClassCardProps = {
	coachClass: TrainingClass;
};

const CoachClassCard: React.FC<CoachClassCardProps> = ({ coachClass }) => {
	// 1. Context hooks
	// (No context hooks)

	// 2. State hooks
	// (No state hooks)

	// 3. Effects
	// (No effects)

	// 4. Functions
	// (No local functions)

	// 5. Render
	return (
		<li className="flex flex-col md:flex-row md:items-center bg-white border border-gray-200 rounded-lg shadow p-6 gap-4 mx-auto w-full max-w-2xl transition-transform transition-shadow duration-200 hover:scale-125 hover:shadow-xl cursor-pointer">
			<div className="flex-1 text-center md:text-left">
				<div className="text-lg font-semibold text-gray-800 mb-1">
					{coachClass.name}
				</div>
				<div className="text-gray-600 mb-2">
					<span className="font-medium">Location:</span>{' '}
					{coachClass.dojaangName ?? ''}
				</div>
				<div>
					<span className="font-medium text-gray-700">Schedule:</span>
					<ul className="ml-0 mt-1 list-none text-gray-500 space-y-1 flex flex-col items-center">
						{coachClass.schedules.map((s) => {
							const dayLabel =
								daysOfWeek.find((d) => d.value === Number(s.day))
									?.label ?? `Day ${s.day}`;
							return (
								<li
									key={s.id}
									className="py-0.5 flex justify-center"
								>
									<span className="font-medium text-gray-700">
										{dayLabel}
									</span>
									<span className="mx-2">|</span>
									<span>
										{s.startTime} - {s.endTime}
									</span>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</li>
	);
};

export default CoachClassCard;
