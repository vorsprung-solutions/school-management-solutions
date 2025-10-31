import Students from "@/components/pages/academic/students/Students";
import Title from "@/components/shared/title";

export default function StudentsPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <h1>
          <Title value="Student Information" />
        </h1>

        <div className="mt-6">
          <Students />
        </div>
      </div>
    </>
  );
}
