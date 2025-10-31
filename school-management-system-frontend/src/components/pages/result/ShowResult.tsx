const result = {
  student: "66bcf3219b6a2c6d24a11111",
  organization: "66bcf3219b6a2c6d24a22222",
  exam_name: "Final Examination",
  year: 2025,
  class: 12,
  session: 2024,
  group: "Science",
  results: [
    { subject: "Bangla", marks: 85, grade: "A", gpa: 4.0 },
    { subject: "English", marks: 78, grade: "A", gpa: 3.8 },
    { subject: "Physics", marks: 90, grade: "A+", gpa: 4.0 },
    { subject: "Chemistry", marks: 88, grade: "A", gpa: 4.0 },
    { subject: "Mathematics", marks: 95, grade: "A+", gpa: 4.0 },
  ],
  total_marks: 436,
  gpa: 4.0,
  grade: "A+",
  is_passed: true,
};

export default function ShowResult() {
  return (
    <div className="w-full bg-gray-100 shadow-xl rounded-2xl p-4">
      <div className="text-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-black">{result.exam_name}</h1>
        <p className="text-black">
          Year {result.year} • Class {result.class} • Session {result.session}
        </p>
        {result.group && <p className="text-black">Group: {result.group}</p>}
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#1D293D] text-white">
            <th className="py-2 px-4 border">Subject</th>
            <th className="p-2 border text-center">Marks</th>
            <th className="p-2 border text-center">Grade</th>
            <th className="p-2 border text-center">GPA</th>
          </tr>
        </thead>
        <tbody>
          {result.results.map((res, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="py-2 px-4 border">{res.subject}</td>
              <td className="p-2 border text-center">{res.marks}</td>
              <td className="p-2 border text-center font-medium">
                {res.grade}
              </td>
              <td className="p-2 border text-center">{res.gpa.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 p-4 bg-white rounded-xl flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            Total Marks:{" "}
            <span className="font-semibold">{result.total_marks}</span>
          </p>
          <p className="text-gray-600">
            Overall GPA:{" "}
            <span className="font-semibold">{result.gpa.toFixed(2)}</span>
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              result.is_passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {result.is_passed ? "PASSED" : "FAILED"}
          </p>
          <p className="text-gray-600">
            Grade: <span className="font-semibold">{result.grade}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
