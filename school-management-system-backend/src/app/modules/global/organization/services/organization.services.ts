import { Organization } from '../repository/schema/organization.schema';
import { IOrganization } from '../interface/organization.interface';
import { JwtPayload } from 'jsonwebtoken';
import { TImageFile } from '../../../../interface/image.interface';
import AppError from '../../../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { User } from '../../user/repository/schema/user.schema';
import { Admin } from '../../../generic/admin/repository/schema/admin.schema';
import { USER_ROLE } from '../../user/user.constance';

const getOrganizationById = async (organizationId: string) => {
  const organization = await Organization.findById(organizationId);
  
  if (!organization) {
    throw new AppError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  
  return organization;
};

const getOrganizationByUser = async (user: JwtPayload) => {
  const organization = await Organization.findById(user.organization);
  
  if (!organization) {
    throw new AppError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  
  return organization;
};

const updateOrganization = async (
  user: JwtPayload,
  payload: Partial<IOrganization>,
  file?: TImageFile
) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const organization = await Organization.findById(user.organization).session(session);
    
    if (!organization) {
      throw new AppError(httpStatus.NOT_FOUND, 'Organization not found');
    }
    
    const updateData = { ...payload };
    
    // Handle logo upload if provided
    if (file?.path) {
      updateData.logo = file.path;
    }
     
    
    if (payload.social && typeof payload.social === 'string') {
      try {
        const parsedSocial = JSON.parse(payload.social);
        console.log('Parsed social data:', parsedSocial);
        // Merge with existing social data, only update provided fields
        updateData.social = {
          ...organization.social,
          ...parsedSocial
        };
        console.log('Final social data to save:', updateData.social);
      } catch (error) {
        console.error('Error parsing social field:', error);
        // If parsing fails, keep the original value
      }
    } else if (payload.social && typeof payload.social === 'object') {
      // If social is already an object, merge directly
      updateData.social = {
        ...organization.social,
        ...payload.social
      };
      console.log('Direct object social data to save:', updateData.social);
    }
    

    
    // Check for unique constraints if email, subdomain, or customdomain is being updated
    if (payload.email && payload.email !== organization.email) {
      // Check if organization email already exists
      const emailExists = await Organization.findOne({ 
        email: payload.email,
        _id: { $ne: organization._id }
      }).session(session);
      
      if (emailExists) {
        throw new AppError(
          httpStatus.CONFLICT,
          'Organization with this email already exists'
        );
      }

      // Check if admin email already exists in other organizations
      const adminEmailExists = await Admin.findOne({ 
        email: payload.email,
        organization: { $ne: organization._id }
      }).session(session);
      
      if (adminEmailExists) {
        throw new AppError(
          httpStatus.CONFLICT,
          'Admin with this email already exists in another organization'
        );
      }

      // Check if user email already exists in other organizations
      const userEmailExists = await User.findOne({ 
        email: payload.email,
        organization: { $ne: organization._id }
      }).session(session);
      
      if (userEmailExists) {
        throw new AppError(
          httpStatus.CONFLICT,
          'User with this email already exists in another organization'
        );
      }
    }
    
    if (payload.subdomain && payload.subdomain !== organization.subdomain) {
      const subdomainExists = await Organization.findOne({ 
        subdomain: payload.subdomain,
        _id: { $ne: organization._id }
      }).session(session);
      
      if (subdomainExists) {
        throw new AppError(
          httpStatus.CONFLICT,
          'Organization with this subdomain already exists'
        );
      }
    }
    
    if (payload.customdomain && payload.customdomain !== organization.customdomain) {
      const customDomainExists = await Organization.findOne({ 
        customdomain: payload.customdomain,
        _id: { $ne: organization._id }
      }).session(session);
      
      if (customDomainExists) {
        throw new AppError(
          httpStatus.CONFLICT,
          'Organization with this custom domain already exists'
        );
      }
    }
    
    const result = await Organization.findByIdAndUpdate(
      organization._id,
      updateData,
      { new: true, session }
    );

    // If organization email is being updated, also update admin and user emails
    if (payload.email && payload.email !== organization.email) {
      const newEmail = payload.email;
      const organizationId = organization._id;

      try {
        // Update admin email
        const adminUpdateResult = await Admin.findOneAndUpdate(
          { organization: organizationId },
          { email: newEmail },
          { session, new: true }
        );

        // Update user email (find user with admin role for this organization)
        const userUpdateResult = await User.findOneAndUpdate(
          { 
            organization: organizationId,
            role: USER_ROLE.admin
          },
          { email: newEmail },
          { session, new: true }
        );

        if (!adminUpdateResult) {
          console.warn(`No admin found for organization: ${organizationId}`);
        }

        if (!userUpdateResult) {
          console.warn(`No user with admin role found for organization: ${organizationId}`);
        }

        console.log(`Successfully updated admin and user emails to: ${newEmail} for organization: ${organizationId}`);
      } catch (error) {
        console.error('Error updating admin/user emails:', error);
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Failed to update admin and user emails'
        );
      }
    }
    
    await session.commitTransaction();
    session.endSession();
    
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getOrganizationByDomain = async (domain: string) => {
  const organization = await Organization.findOne({
    $or: [
      { subdomain: domain },
      { customdomain: domain }
    ]
  }).select('-plan_type -subscription_status -expire_at -createdAt -updatedAt');
  
  if (!organization) {
    throw new AppError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  
  return organization;
};

export const OrganizationServices = {
  getOrganizationById,
  getOrganizationByUser,
  updateOrganization,
  getOrganizationByDomain,
};
