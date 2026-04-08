import { useGetOrganizationByDomainQuery } from "@/redux/features/organization/organizationApi";
import useDomain from "./useDomain";

const useOrganization = () => {
  const domain = useDomain();
  const { data, isLoading } = useGetOrganizationByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  return { data: data?.data, isLoading };
};

export default useOrganization;
