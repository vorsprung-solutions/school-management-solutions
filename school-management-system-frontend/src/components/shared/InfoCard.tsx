import Image from "next/image";
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

export default function InfoCard({
  data,
  setShowModal,
  setModal,
}: {
  data: IData;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<IData | null>>;
}) {
  return (
    <div className="w-full px-2 py-5 bg-[#1d293d0c] rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
      <div className="flex justify-center mt-6">
        {/* this image tag will convert to nextjs Image tag */}

        <Image
          src={data.profilePicture ||  teacherPro}
          alt={data.name}
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded-full border-6 border-white shadow-lg"
        />
      </div>

      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold text-gray-800">{data.name}</h2>
        <p className="text-blue-600 font-medium text-xs">
          - {data.designation}
        </p>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={() => {
            setModal(data);
            setShowModal(true);
          }}
          className="cursor-pointer hover:text-blue-600 font-semibold hover:underline transition"
        >
          Show More
        </button>
      </div>
    </div>
  );
}
