import { Skeleton } from "../ui/skeleton";

const LoadingAnimationStudentAndTeacher = () => (
  <div className="w-full space-y-5">
    <div className="bg-white shadow-lg rounded-md w-full h-[180px] p-8">
      <Skeleton className="bg-gray-200 w-full h-full" />
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white shadow-lg rounded-md w-full h-[180px] p-8">
        <Skeleton className="bg-gray-200 w-full h-full" />
      </div>
      <div className="bg-white shadow-lg rounded-md w-full h-[180px] p-8">
        <Skeleton className="bg-gray-200 w-full h-full" />
      </div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white shadow-lg rounded-md w-full h-[180px] p-8">
        <Skeleton className="bg-gray-200 w-full h-full" />
      </div>
      <div className="bg-white shadow-lg rounded-md w-full h-[180px] p-8">
        <Skeleton className="bg-gray-200 w-full h-full" />
      </div>
      <div className="bg-white shadow-lg rounded-md w-full h-[180px] p-8">
        <Skeleton className="bg-gray-200 w-full h-full" />
      </div>
    </div>
  </div>
);

export default LoadingAnimationStudentAndTeacher;
