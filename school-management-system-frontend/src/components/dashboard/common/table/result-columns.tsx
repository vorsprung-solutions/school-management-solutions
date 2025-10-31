"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export enum GradeEnum {
  A_PLUS = "A+",
  A = "A",
  A_MINUS = "A-",
  B = "B",
  C = "C",
  D = "D",
  F = "F",
}

export interface IResult {
  student: string;
  organization: string;

  exam_name: string;
  year: number;
  class: number;
  session: number;
  group?: string;

  results: {
    subject: string;
    marks: number;
    grade: GradeEnum;
    gpa: number;
  }[];

  total_marks: number;
  gpa: number;
  grade: GradeEnum;
  is_passed: boolean;
}

interface CellActionProps {
  data: IResult;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  return (
    <AlertDialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/teacher/dashboard/result/${data.student}`)
            }
          >
            <span className="flex">
              <Eye className="mr-2 h-4 w-4" /> View
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/teacher/dashboard/result/update/${data.student}`)
            }
          >
            <span className="flex">
              <Edit className="mr-2 h-4 w-4" /> Update
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <AlertDialogTrigger>
              <span className="flex">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </span>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              //              authorizedAPI
              //                .delete(`/work/${data._id}`)
              //                .then(() => {
              //                  toast.success("Project deleted successfully!");
              //                  refreshTag("work");
              //                })
              //                .catch((error) => toast.error("Something went wrong!"));
            }}
            className="bg-red-600 text-white"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<IResult>[] = [
  {
    accessorKey: "exam_name",
    header: "EXAM NAME",
  },
  {
    accessorKey: "year",
    header: "YEAR",
    meta: {
      className: "text-center",
    },
  },
  {
    accessorKey: "class",
    header: "CLASS",
    meta: {
      className: "text-center",
    },
  },
  {
    accessorKey: "session",
    header: "SESSION",
    meta: {
      className: "text-center",
    },
  },
  {
    accessorKey: "gpa",
    header: "GPA",
    meta: {
      className: "text-center",
    },
  },
  {
    accessorKey: "grade",
    header: "GRADE",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    meta: {
      className: "text-right",
    },
    size: 50,
  },
];
