import { GENDER_LABELS } from "@/app/const/genders";
import { useRanks } from "@/app/context/RankContext";
import { User } from "@/app/types/User";
import React from "react";

type ProfileInfoProps = {
  user: User;
};

// 4. Functions
function getGenderLabel(value: number) {
  const found = GENDER_LABELS.find((g) => g.value === value);
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
  // 1. Context hooks
  const { ranks } = useRanks();

  // 5. Render
  const rankName =
    user.currentRankId && ranks.length > 0
      ? ranks.find((r) => r.id === user.currentRankId)?.name ||
        `ID: ${user.currentRankId}`
      : user.currentRankId
      ? `ID: ${user.currentRankId}`
      : null;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {/* Name */}
        <div className="font-semibold text-gray-700 text-right sm:text-left">
          Name:
        </div>
        <div className="text-right sm:text-left">
          {user.firstName} {user.lastName}
        </div>

        {/* Email */}
        <div className="font-semibold text-gray-700 text-right sm:text-left">
          Email:
        </div>
        <div className="text-right sm:text-left">{user.email}</div>

        {/* Phone */}
        {user.phoneNumber && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">
              Phone:
            </div>
            <div className="text-right sm:text-left">{user.phoneNumber}</div>
          </>
        )}

        {/* Gender */}
        {user.gender !== undefined && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">
              Gender:
            </div>
            <div className="text-right sm:text-left">
              {getGenderLabel(user.gender)}
            </div>
          </>
        )}

        {/* Date of Birth */}
        {user.dateOfBirth && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">
              Date of Birth:
            </div>
            <div className="text-right sm:text-left">
              {formatDate(user.dateOfBirth)}
            </div>
          </>
        )}

        {/* Current Rank */}
        {rankName && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">
              Current Rank:
            </div>
            <div className="text-right sm:text-left">{rankName}</div>
          </>
        )}

        {/* Join Date */}
        {user.joinDate && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">
              Join Date:
            </div>
            <div className="text-right sm:text-left">
              {formatDate(user.joinDate)}
            </div>
          </>
        )}

        {/* Roles */}
        {user.roles && (
          <>
            <div className="font-semibold text-gray-700 text-right sm:text-left">
              Roles:
            </div>
            <div className="text-right sm:text-left">
              {user.roles.join(", ")}
            </div>
          </>
        )}

        {/* Status */}
        <div className="font-semibold text-gray-700 text-right sm:text-left">
          Status:
        </div>
        <div className="text-right sm:text-left">
          {user.isActive ? "Active" : "Inactive"}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
