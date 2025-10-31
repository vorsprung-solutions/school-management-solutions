import Teachers from "@/components/pages/academic/teachers/Teachers";
import Title from "@/components/shared/title";

export default function TeachersPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <h1>
          <Title value="Teachers Information" />
        </h1>

        <Teachers />
      </div>
    </>
  );
}
