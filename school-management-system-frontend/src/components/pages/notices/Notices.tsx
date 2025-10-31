import Link from "next/link";
import { Button } from "../../ui/button";

type notice = {
  date: string;
  title: string;
};

export default function Notices({ data }: { data: notice[] }) {
  return (
    <table className="min-w-full border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
      <thead className="bg-[#1D293D] text-white">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-semibold hidden md:block">
            No.
          </th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
          <th className="pr-4 py-3 text-left text-sm font-semibold">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((notice, id) => (
          <tr
            key={"notice-serial-no" + id}
            className="hover:bg-blue-50 transition-colors"
          >
            <td className="px-4 py-3 text-gray-700 hidden md:block">
              {id + 1}
            </td>
            <td className="px-4 py-3 text-gray-600">{notice?.date}</td>
            <td className="px-4 py-3 text-gray-700 font-medium hover:text-blue-600">
              <Link href={`/notices/${id}`} className="cursor-pointer">
                {notice?.title}
              </Link>
            </td>
            <td>
              <Button className="cursor-pointer hover:bg-blue-700 transition-all duration-300">
                Download
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
