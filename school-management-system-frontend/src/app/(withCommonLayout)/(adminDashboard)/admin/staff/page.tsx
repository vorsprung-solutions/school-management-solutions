"use client"

import { useCallback, useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  Trash2,
  RefreshCw,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UserCheck,
  UserX,
  Mail,
  Building2,
  RotateCcw,
} from "lucide-react"
import useDomain from "@/hooks/useDomain"
import Swal from "sweetalert2"
import Link from "next/link"
import {
  useGetAllStaffByDomainQuery,
  useDeleteStaffByIdMutation,
  useBlockStaffByIdMutation,
} from "@/redux/features/staff/staffApi"
import type { IStaff } from "@/types/staff"

export default function AllStaff() {
  const domain = useDomain()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const {
    data: staffData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllStaffByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  })

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffByIdMutation()
  const [toggleStatus, { isLoading: isToggling }] = useBlockStaffByIdMutation()

  const staff = staffData?.data || []

  // Pagination logic
  const totalPages = Math.ceil(staff.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStaff = staff.slice(startIndex, endIndex)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = useCallback(
    (id: string, name: string, isDeleted: boolean) => {
      console.log("[v0] Delete Toggle - Raw ID:", id, "Type:", typeof id)

      if (!id || id === "undefined" || id === "null") {
        console.error("[v0] Delete Toggle - Invalid ID provided:", id)
        Swal.fire({
          title: "Error!",
          text: "Invalid staff ID. Please refresh and try again.",
          icon: "error",
        })
        return
      }

      const cleanId = String(id).trim()
      const actionText = isDeleted ? "restore" : "delete"

      Swal.fire({
        title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Staff?`,
        text: `Are you sure you want to ${actionText} ${name}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: isDeleted ? "#10b981" : "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Yes, ${actionText}!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            console.log("[v0] Delete Toggle - Sending ID to API:", cleanId)
            await deleteStaff(cleanId).unwrap()
            Swal.fire({
              title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)}d!`,
              text: `${name} has been ${actionText}d.`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            })
            if (currentStaff.length === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1)
            }
          } catch (error) {
            console.error(`[v0] ${actionText} error:`, error)
            Swal.fire({
              title: "Error!",
              text: `Failed to ${actionText} staff member. Please try again.`,
              icon: "error",
            })
          }
        }
      })
    },
    [deleteStaff, currentStaff.length, currentPage],
  )

  const handleToggleStatus = useCallback(
    (id: string, name: string, isBlocked: boolean) => {
      if (!id || id === "undefined" || id === "null") {
        console.error("[v0] Toggle Status - Invalid ID provided:", id)
        Swal.fire({
          title: "Error!",
          text: "Invalid user ID. Please refresh and try again.",
          icon: "error",
        })
        return
      }

      const cleanId = String(id).trim()
      const actionText = isBlocked ? "unblock" : "block"

      Swal.fire({
        title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Staff?`,
        text: `Are you sure you want to ${actionText} ${name}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: isBlocked ? "#10b981" : "#f59e0b",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Yes, ${actionText}!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            console.log("[v0] Toggle Status - Sending ID to API:", cleanId)
            await toggleStatus(cleanId).unwrap()
            Swal.fire({
              title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)}ed!`,
              text: `${name} has been ${actionText}ed.`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            })
          } catch (error) {
            console.error(`[v0] ${actionText} error:`, error)
            Swal.fire({
              title: "Error!",
              text: `Failed to ${actionText} staff member. Please try again.`,
              icon: "error",
            })
          }
        }
      })
    },
    [toggleStatus],
  )

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  // Reset to first page when data changes
  useMemo(() => {
    if (staff.length > 0 && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [staff.length, currentPage, totalPages])

  return (
    <div className="w-full min-h-screen space-y-6 px-7">
      <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <h2 className="text-3xl font-bold">All Staff</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Link href="/admin/staff/create">Add Staff</Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleRetry}
            disabled={isLoading || isFetching}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="px-6">
          <LoadingStaffTable />
        </div>
      )}

      {!isLoading && !isError && (
        <div className="w-full">
          <div className="min-w-full rounded-lg border bg-card mx-6">
            <Table>
              <TableCaption>
                {staff.length > 0
                  ? `Showing ${startIndex + 1}-${Math.min(endIndex, staff.length)} of ${staff.length} staff member${
                      staff.length === 1 ? "" : "s"
                    }`
                  : "No staff members available"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">No.</TableHead>
                  <TableHead className="text-center">Profile</TableHead>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Designation</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center w-[160px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStaff.length > 0 ? (
                  currentStaff.map((staffMember: IStaff, index: number) => (
                    <TableRow key={staffMember._id} className="hover:bg-muted/50">
                      <TableCell className="text-center font-medium">{startIndex + index + 1}</TableCell>
                      <TableCell className="flex justify-center py-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                          <Image
                            src={
                              staffMember?.profilePicture ||
                              "/placeholder.svg?height=64&width=64&query=staff profile" ||
                              "/placeholder.svg"
                            }
                            alt={staffMember.name || `Staff ${startIndex + index + 1}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                            priority={index < 3}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <span>{staffMember?.name || "No name"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{staffMember?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{staffMember?.designation || "Not assigned"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          {staffMember?.user?.is_deleted && (
                            <Badge variant="destructive" className="text-xs">
                              Deleted
                            </Badge>
                          )}
                          {staffMember?.user?.is_blocked && (
                            <Badge variant="secondary" className="text-xs">
                              Blocked
                            </Badge>
                          )}
                          {!staffMember?.user?.is_deleted && !staffMember?.user?.is_blocked && (
                            <Badge variant="default" className="text-xs bg-green-500">
                              Active
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="outline" size="sm" className="gap-1 h-8 bg-transparent">
                            <Link href={`/admin/staff/${staffMember._id}`} className="flex items-center gap-1">
                              <Edit className="h-3 w-3" />
                              <span className="sr-only sm:not-sr-only text-xs">Edit</span>
                            </Link>
                          </Button>

                          {!staffMember?.user?.is_deleted && (
                            <Button
                              variant={staffMember?.user?.is_blocked ? "default" : "secondary"}
                              size="sm"
                              onClick={() =>
                                handleToggleStatus(
                                  String(staffMember?.user?._id),
                                  staffMember.name,
                                  !!staffMember?.user?.is_blocked,
                                )
                              }
                              disabled={isToggling}
                              className="gap-1 h-8"
                            >
                              {staffMember?.user?.is_blocked ? (
                                <UserCheck className="h-3 w-3" />
                              ) : (
                                <UserX className="h-3 w-3" />
                              )}
                              <span className="sr-only sm:not-sr-only text-xs">
                                {staffMember?.user.is_blocked ? "Unblock" : "Block"}
                              </span>
                            </Button>
                          )}

                          <Button
                            variant={staffMember?.user?.is_deleted ? "default" : "destructive"}
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                String(staffMember?.user?._id),
                                staffMember.name,
                                !!staffMember?.user?.is_deleted,
                              )
                            }
                            disabled={isDeleting}
                            className={`gap-1 h-8 ${
                              staffMember?.user?.is_deleted
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "hover:bg-destructive/90"
                            }`}
                          >
                            {staffMember?.user?.is_deleted ? (
                              <RotateCcw className="h-3 w-3" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            <span className="sr-only sm:not-sr-only text-xs">
                              {staffMember?.user?.is_deleted ? "Restore" : "Delete"}
                            </span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                        <span>No staff members found. Add some staff to see them here.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-1 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className="h-8 w-8 p-0"
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">{itemsPerPage} per page</div>
            </div>
          )}
        </div>
      )}

      {isError && (
        <div className="px-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load staff</h3>
            <p className="text-muted-foreground mb-4">There was an error loading the staff data. Please try again.</p>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

const LoadingStaffTable = () => (
  <div className="w-full overflow-x-auto">
    <div className="min-w-full rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">No.</TableHead>
            <TableHead className="text-center">Profile</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Designation</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-[160px] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-8 rounded-md mx-auto" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center py-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-32 rounded-md mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-40 rounded-md mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-28 rounded-md mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-16 rounded-md mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Skeleton className="h-8 w-12 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-14 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
)


