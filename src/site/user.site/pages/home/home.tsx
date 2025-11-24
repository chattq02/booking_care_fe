import { Row, Col, Layout, Flex, Spin } from "antd";
import {
  HeartFilled,
  TrophyOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { DoctorCard } from "../doctors/components/doctor-card";
import { useGetListDoctor } from "../doctors/hooks/useDoctor";
import BlockHome from "./components/block-home";
import { useGetListFacility } from "../facility/hooks/useFacility";
import { FacilityCard } from "../facility/components/facility-card";
import { useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "../../lib/enums/path";

const { Content } = Layout;

export default function Home() {
  const { data, isLoading: loading_doctor } = useGetListDoctor({
    keyword: "",
    page: 1,
    per_page: 6,
  });

  const { data: data_facility, isLoading: loading_facility } =
    useGetListFacility({
      keyword: "",
      page: 1,
      per_page: 6,
    });

  const nav = useNavigate();

  return (
    <Layout className="bg-linear-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Content className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header với lời chào */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-12">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl p-6 sm:p-8 lg:p-12 shadow-xl mb-6 sm:mb-8 transform hover:scale-[1.01] transition-all duration-300">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Chào mừng đến với{" "}
              <span className="text-yellow-300 inline-block">BookingCare</span>
            </h1>
            <p className="text-blue-100 text-base sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
              Khám phá hệ thống bệnh viện và bác sĩ uy tín nhất để chăm sóc sức
              khỏe toàn diện cho bạn và gia đình
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base">
                <TrophyOutlined className="text-yellow-300 mr-1 sm:mr-2" />
                <span className="text-white">Top 1 Việt Nam</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base">
                <SafetyCertificateOutlined className="text-green-300 mr-1 sm:mr-2" />
                <span className="text-white">Chứng nhận quốc tế</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base">
                <HeartFilled className="text-red-300 mr-1 sm:mr-2" />
                <span className="text-white">Chăm sóc tận tâm</span>
              </div>
            </div>
          </div>
        </div>

        {loading_doctor || loading_facility ? (
          <Spin spinning />
        ) : (
          <Flex vertical gap={50}>
            {/* Khối bệnh viện */}
            <BlockHome
              title="Đặt khám bác sĩ"
              description="Phiếu khám kèm số thứ tự và thời gian của bạn được xác nhận."
              onClickViewMore={() => nav(PATH_ROUTE.LISTDOCTOR)}
            >
              <Row gutter={[16, 16]}>
                {data?.map((val) => (
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
            </BlockHome>

            {/* Khối bệnh viện */}
            <BlockHome
              title="Đặt khám bệnh viện"
              description="Chọn bệnh viện phù hợp với bạn."
              onClickViewMore={() => nav(PATH_ROUTE.LISTFACILITY)}
            >
              <Row gutter={[16, 16]}>
                {data_facility?.map((val) => (
                  <Col key={val.id} xs={24} sm={12} md={8} lg={8}>
                    <FacilityCard
                      id={val.id}
                      name={val.name}
                      imageUrl={val.imageUrl}
                      address={val.address}
                      phone={val.phone}
                    />
                  </Col>
                ))}
              </Row>
            </BlockHome>
          </Flex>
        )}
      </Content>
    </Layout>
  );
}
