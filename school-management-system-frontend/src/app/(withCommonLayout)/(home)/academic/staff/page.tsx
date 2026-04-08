import Staffs from "@/components/pages/academic/staffs/Staffs";
import Title from "@/components/shared/title";

export default function TeachersPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <h1>
          <Title value="Staffs Information" />
        </h1>

        <Staffs />
      </div>
    </>
  );
}
