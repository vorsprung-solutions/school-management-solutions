"use client";

import { useState } from "react";
import useDomain from "@/hooks/useDomain";
import { useGetAllTeacherByDomainQuery } from "@/redux/features/teacher/teacherApi";
import InfoCard from "../../../shared/InfoCard";
import InfoModal from "../../../shared/InfoModal";
import LoadingCardTeacherAndStaff from "@/components/shared/loadingcard-teacher-staff";

type IData = {
  name: string;
  email: string;
  phone: string;
  ephone: string;
  profilePicture?: string;
  designation: string;
  join_date: Date;
};

const Teachers = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModal] = useState<IData | null>(null);
  const domain = useDomain();
  const { data: teachersAll, isLoading } = useGetAllTeacherByDomainQuery(
    domain,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const teachers = teachersAll?.data || [];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {isLoading && <LoadingCardTeacherAndStaff />}

        {!isLoading &&
          teachers &&
          teachers.map((teacher: IData, id: number) => (
            <div key={"teacher" + id}>
              <InfoCard
                data={teacher}
                setShowModal={setShowModal}
                setModal={setModal}
              />
            </div>
          ))}
      </div>

      {teachers?.length < 1 && !isLoading && (
        <div className="flex justify-center items-center w-full h-[350px] bg-white rounded-2xl shadow-xl">
          <div className="text-2xl">No Data Available</div>
        </div>
      )}

      {showModal && modalData && (
        <InfoModal data={modalData} onClose={setShowModal} />
      )}
    </>
  );
};

export default Teachers;
