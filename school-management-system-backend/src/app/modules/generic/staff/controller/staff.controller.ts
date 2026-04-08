import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../../utils/catchAsynch";
import sendResponse from "../../../../utils/sendResponse";
import { StaffServices } from "../services/staff.services";
import httpStatus from "http-status";
import { TImageFile } from "../../../../interface/image.interface";

const getSingleStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const staff = await StaffServices.getSingleStaff(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff retrieved successfully",
    data: staff,
  });
});

const getAllStaffs = catchAsync(async (req, res) => {
  const domain = req?.params?.domain;
  const staffs = await StaffServices.getAllStaffs(domain);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staffs retrieved successfully",
    data: staffs,
  });
});

const getAllStaffsByOrganization = catchAsync(async (req, res) => {
  const { id } = req.params;
  const staffs = await StaffServices.getAllStaffsByOrganization(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staffs retrieved successfully",
    data: staffs,
  });
});

const updateStaff = catchAsync(async (req, res) => {
  const payload = req.body;
  const file = req.file;
  const user = req.user;
  const staff = await StaffServices.updateStaff(
    user as JwtPayload,
    payload,
    file as TImageFile
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff updated successfully",
    data: staff,
  });
});

const updateStaffByAdmin = catchAsync(async (req, res) => {
  const payload = req.body;
  const file = req.file;
  const user = req.user;
  const { id } = req.params;
  const staff = await StaffServices.updateStaffByAdmin(
    user as JwtPayload,
    payload,
    id,
    file as TImageFile
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff updated successfully",
    data: staff,
  });
});

const deleteStaffByUserId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const staff = await StaffServices.deleteStaffByUserId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff deleted successfully",
    data: staff,
  });
});

const blockStaffByUserId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const staff = await StaffServices.blockStaffByUserId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff blocked successfully",
    data: staff,
  });
});

export const StaffControllers = {
  getSingleStaff,
  getAllStaffs,
  getAllStaffsByOrganization,
  updateStaff,
  updateStaffByAdmin,
  deleteStaffByUserId,
  blockStaffByUserId,
};
