import { Row, Col, Button, Layout } from "antd";
import {
  StarFilled,
  HeartFilled,
  TrophyOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { DoctorCard } from "../doctors/components/doctor-card";
import { v4 } from "uuid";

const { Content } = Layout;

export default function Home() {
  return (
    <Layout className="bg-linear-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Content className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header với lời chào */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl p-6 sm:p-8 lg:p-12 shadow-xl mb-6 sm:mb-8 transform hover:scale-[1.01] transition-all duration-300">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Chào mừng đến với{" "}
              <span className="text-yellow-300 inline-block">MediCare</span>
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

        {/* Khối bệnh viện */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <div className="flex items-center mb-2">
                <StarFilled className="text-xl sm:text-2xl text-green-500 mr-2 sm:mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Bệnh viện hàng đầu
                </h2>
              </div>
              <p className="text-gray-600 text-base sm:text-lg">
                Lựa chọn bệnh viện phù hợp với nhu cầu của bạn
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              className="bg-linear-to-r from-green-500 to-blue-500 border-0 hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
            >
              Xem tất cả bệnh viện
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Col key={i} xs={24} sm={12} md={8} lg={6}>
                <DoctorCard
                  id={v4()}
                  name="Nguyễn Văn My"
                  specialty="Truyền nhiễm"
                  imageUrl="https://img5.thuthuatphanmem.vn/uploads/2021/11/20/anh-cute-nguoi-that-dep-nhat_022606213.jpg"
                />
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
