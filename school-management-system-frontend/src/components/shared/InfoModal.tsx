import Modal from "@/components/ui/modal";
import Image from "next/image";
import React from "react";
const teacherPro = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
type IData = {
  name: string;
  email: string;
  phone: string;
  ephone: string;
  profilePicture?: string;
  designation: string;
  join_date: Date;
};

const InfoModal = ({
  onClose,
  data,
}: {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  data: IData;
}) => {
  return (
    <Modal onClose={onClose}>
      <div>
        <div className="flex flex-col items-center p-6">
          <Image
            src={data?.profilePicture as string || teacherPro}
            alt={data?.name}
            width={128}
            height={128}
            className="w-32 h-32 rounded-full border-6 border-whiteobject-cover"
          />
          <h3 className="mt-4 text-2xl font-bold">{data?.name}</h3>
          <p className="text-blue-400 font-medium">{data?.designation}</p>
        </div>

        <div className="bg-white text-[#1D293D] px-6 py-5">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{data?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{data?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Emergency Phone</p>
              <p className="font-medium">{data?.ephone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Join Date</p>
              <p className="font-medium">
                {new Date(
                  data?.join_date || "2019-03-19T00:00:00.000Z"
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }) || "জানুয়ারি ২০১৮"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InfoModal;
