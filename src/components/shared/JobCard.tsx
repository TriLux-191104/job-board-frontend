// src/components/shared/JobCard.tsx
import { Link } from "react-router-dom"; // 1. Import Link
import type { IJob } from "../../types/job.type";

interface JobCardProps {
  job: IJob;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    // 2. Thay thẻ div ngoài cùng bằng thẻ Link
    // Thêm block để nó chiếm toàn bộ chiều ngang
    <Link
      to={`/job/${job._id}`}
      className="block bg-white border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow cursor-pointer group no-underline"
    >
      <div className="flex gap-4">
        {/* Logo công ty */}
        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
          {job.company.logo ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${job.company.logo}`}
              alt={job.company.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xl font-bold text-gray-400">
              {job.company.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Thông tin Job */}
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
            {job.name}
          </h3>
          <p className="text-sm text-gray-600 font-medium mb-2">
            {job.company.name}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {job.skills.map((skill) => (
              <span
                key={skill._id}
                className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase font-semibold"
              >
                {skill.name}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-red-600 font-bold text-sm">
              $ {job.salary.toLocaleString()}
            </span>
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {job.location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
