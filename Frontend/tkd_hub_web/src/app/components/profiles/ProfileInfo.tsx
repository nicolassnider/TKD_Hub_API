import { GENDER_LABELS } from "@/app/const/genders";
import { useRankContext } from "@/app/context/RankContext";
import { User } from "@/app/types/User";
import React from "react";

type ProfileInfoProps = {
  user: User;
};

function getGenderLabel(value: number) {
  const found = GENDER_LABELS.find(g => g.value === value);
  return found ? found.label : "Unknown";
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const { ranks } = useRankContext();

  const rankName =
    user.currentRankId && ranks.length > 0
      ? ranks.find(r => r.id === user.currentRankId)?.name || `ID: ${user.currentRankId}`
      : user.currentRankId
        ? `ID: ${user.currentRankId}`
        : null;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 transition-transform duration-200 hover:scale-150 hover:shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">

        <div className="font-semibold text-gray-700 text-right sm:text-left">Name:</div>
        <div className="text-right">{user.firstName} {user.lastName}</div>

        <div className="font-semibold text-gray-700 text-right sm:text-left">Email:</div>
        <div className="text-right">{user.email}</div>

        {user.phoneNumber && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">Phone:</div>
            <div className="text-right">{user.phoneNumber}</div>
          </>
        )}

        {user.gender !== undefined && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">Gender:</div>
            <div className="text-right">{getGenderLabel(user.gender)}</div>
          </>
        )}

        {user.dateOfBirth && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">Date of Birth:</div>
            <div className="text-right">{formatDate(user.dateOfBirth)}</div>
          </>
        )}

        {rankName && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">Current Rank:</div>
            <div className="text-right">{rankName}</div>
          </>
        )}

        {user.joinDate && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">Join Date:</div>
            <div className="text-right">{formatDate(user.joinDate)}</div>
          </>
        )}

        {user.roles && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">Roles:</div>
            <div className="text-right">{user.roles.join(", ")}</div>
          </>
        )}

        <div className="font-semibold text-gray-700 text-right sm:text-left">Status:</div>
        <div className="text-right">{user.isActive ? "Active" : "Inactive"}</div>
      </div>
    </div>
  );
};

export default ProfileInfo;
