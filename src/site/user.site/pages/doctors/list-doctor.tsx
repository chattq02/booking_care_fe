import { Col, Layout, Row, Spin } from "antd";

import { useInView } from "react-intersection-observer";
import { DoctorCard } from "./components/doctor-card";
import { useGetListDoctor } from "./hooks/useDoctor";

const { Content } = Layout;

export default function ListDoctor() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetListDoctor({
      keyword: "",
      per_page: 20,
      page: 1,
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
    <Layout className="bg-linear-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Content className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="text-2xl sm:text-3xl font-semibold mb-6">
          Danh sách bác sĩ
        </div>

        <Row gutter={[16, 16]}>
          {data.map((val) => (
            <Col key={val.id} xs={24} sm={12} md={8} lg={8}>
              <DoctorCard
                role={val.academicTitle.name}
                id={val.id}
                name={val.fullName}
                specialty={val.departments}
                imageUrl={val.avatar}
                facilities={val.facilities}
              />
            </Col>
          ))}
        </Row>

        {/* Loading indicator */}
        <div ref={ref} className="h-20 flex justify-center items-center">
          {(isLoading || isFetchingNextPage) && <Spin size="large" />}
          {!hasNextPage && data.length > 0 && (
            <div className="text-gray-500">Đã hiển thị tất cả bác sĩ</div>
          )}
        </div>

        {!isLoading && data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy bác sĩ nào
          </div>
        )}
      </Content>
    </Layout>
  );
}
