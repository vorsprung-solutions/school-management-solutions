import { Skeleton } from "../ui/skeleton";

const LoadingCardTeacherAndStaff = () =>
  Array.from({ length: 8 }).map((_, index: number) => (
    <div
      key={"all-teachers-by-doamin" + index}
      className="p-4 rounded-2xl h-[280px] space-y-3 px-2 py-5 bg-[#1d293d0c]"
    >
      <div className="flex justify-center">
        <Skeleton className="bg-white w-24 h-24 rounded-full border-4 border-gray-200" />
      </div>
      <Skeleton className="bg-gray-300 w-full h-12" />
      <Skeleton className="bg-gray-300 w-full h-5" />
      <div className="flex justify-center mt-8">
        <Skeleton className="bg-gray-300 w-[140px] h-5" />
      </div>
    </div>
  ));

export default LoadingCardTeacherAndStaff;
