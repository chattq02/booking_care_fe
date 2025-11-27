import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/helpers/helper";
import { Card, Col, Empty, Layout, Row, Spin } from "antd";
import { useGetUsersDepartmentInfinite } from "../hooks/useFacility";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "@/site/user.site/lib/enums/path";

interface IProps {
  facilityId: Number;
  departmentId?: Number | null;
}

const { Content } = Layout;

export default function ListDoctorDepartment({
  facilityId,
  departmentId,
}: IProps) {
  const nav = useNavigate();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetUsersDepartmentInfinite(Number(departmentId), {
      keyword: "",
      per_page: 10,
      page: 1,
      facilityId: Number(facilityId),
    });

  const { ref } = useInView({
    skip: !hasNextPage || isFetchingNextPage,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    threshold: 0.1,
  });
  return (
    <Layout className="bg-white max-h-[500px]! overflow-y-auto">
      <Content className="p-4">
        <Row gutter={[16, 16]}>
          {data?.map((val) => (
            <Col key={val.id} xs={24} sm={24} md={24} lg={12}>
              <Card
                key={val.id}
                onClick={() => nav(`${PATH_ROUTE.DOCTORS}/${val.id}`)}
                classNames={{
                  body: "p-4.5!",
                }}
                className="shadow-none rounded-md hover:shadow-md hover:border gap-0 transition-all duration-300 border border-gray-100 hover:border-blue-100 p-2.5 sm:p-3 w-full bg-white hover:bg-linear-to-br hover:from-white hover:to-blue-50/30 "
              >
                <div className="flex gap-4 items-center cursor-pointer  group-hover:from-blue-500/5 group-hover:via-purple-500/3 group-hover:to-pink-500/5 transition-all duration-500 ">
                  <div className="w-28 h-30 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-md transition-all duration-300">
                    <Avatar className="h-full w-full rounded-md! object-cover">
                      <AvatarImage src={val.avatar ?? ""} alt={val.fullName} />
                      <AvatarFallback className="h-full w-full rounded-md! object-cover text-[30px] font-bold bg-[#d4f3ee]">
                        {getFirstLetter(val.fullName ?? "")}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="p-0 flex-1">
                    <Badge
                      variant="secondary"
                      className="w-fit text-xs font-medium bg-[#e0e5eb] text-[#455768]"
                    >
                      {val.academicTitle.name}
                    </Badge>
                    <div className="mt-1 font-bold text-[#101519] line-clamp-2 text-[16px]">
                      {val.fullName}
                    </div>
                    <div className="mt-1 line-clamp-2 text-[13px] text-[#455768] font-semibold">
                      {val.address}
                    </div>
                    <div className="line-clamp-2">
                      <div className="mt-1">
                        <div className="text-[13px] text-[#455768]">
                          Hotline: {val.phone ?? "_"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Loading indicator */}
        <div ref={ref} className="pt-4 flex justify-center items-center">
          {(isLoading || isFetchingNextPage) && <Spin size="large" />}
          {!hasNextPage && data.length > 0 && (
            <div className="text-gray-500">Đã hiển thị tất cả bác sĩ</div>
          )}
        </div>

        {!isLoading && data.length === 0 && (
          <Empty
            description="Không tìm thấy bác sĩ"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-10"
          />
        )}
      </Content>
    </Layout>
  );
}
