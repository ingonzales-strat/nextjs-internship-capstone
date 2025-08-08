import { statusArray } from "@/lib/constants";

type ProjectStatusChipProps = {
  statusId: number;
};

export default function ProjectStatusChip({ statusId }: ProjectStatusChipProps) {
    return (<div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
              statusId === 2
                ? "bg-blue_munsell-100 text-blue_munsell-700 dark:bg-blue_munsell-900 dark:text-blue_munsell-300"
                : statusId === 1
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                : statusId === 4
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {statusArray[statusId-1]}
        </span>
    </div>)
}