import { useGetAboutByDomainQuery } from "@/redux/features/about/aboutApi";
import useDomain from "./useDomain";

const useAbout = () => {
  const domain = useDomain();
  const { data, isLoading } = useGetAboutByDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  return { data: data?.data, isLoading };
};

export default useAbout;
