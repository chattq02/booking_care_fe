import {
  Card,
  Row,
  Col,
  Tag,
  Tabs,
  Image,
  Space,
  Typography,
  Grid,
  Spin,
  Layout,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useGetFacility } from "./hooks/useFacility";
import { useParams, useSearchParams } from "react-router-dom";
import TabDepartment from "./components/tab-department";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { Content } = Layout;

const FacilityDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const validTabs = ["introduce", "sepcility"];

  const tabFromUrl = searchParams.get("tab");
  const activeTab = validTabs.includes(tabFromUrl || "")
    ? tabFromUrl!
    : "introduce";

  const screens = useBreakpoint();
  const { data, isLoading } = useGetFacility(Number(id));

  const handleActiveTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  if (isLoading)
    return (
      <Spin
        size="large"
        style={{
          width: "100%",
        }}
      />
    );

  return (
    <Layout className="bg-linear-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Content className=" mx-auto w-full">
        {/* Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "30px 24px",
            color: "white",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={14}>
                <Space direction="vertical" size="large">
                  <div>
                    <Tag
                      color="gold"
                      style={{
                        border: "none",
                        borderRadius: 16,
                        padding: "4px 12px",
                        marginBottom: 12,
                      }}
                    >
                      <TrophyOutlined /> Bệnh viện xuất sắc 2023
                    </Tag>
                    <Title
                      level={1}
                      style={{
                        color: "white",
                        margin: 0,
                        fontSize: screens.xs ? "28px" : "36px",
                      }}
                    >
                      {data?.name}
                    </Title>
                  </div>

                  <Space direction="vertical" size="small">
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <EnvironmentOutlined />
                      <Text style={{ color: "white" }}>{data?.address}</Text>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <PhoneOutlined />
                      <Text style={{ color: "white" }}>{data?.phone}</Text>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <ClockCircleOutlined />
                      <Text style={{ color: "white" }}>Mở cửa 24/7</Text>
                    </div>
                  </Space>
                </Space>
              </Col>

              <Col xs={24} md={10}>
                <Image
                  height={250}
                  width="100%"
                  style={{
                    borderRadius: 10,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    objectFit: "cover",
                  }}
                  src={data?.imageUrl}
                  alt={data?.name}
                  preview={false}
                />
              </Col>
            </Row>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:px-8 lg:py-8">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Card
              style={{
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                border: "none",
              }}
              className="rounded-md pt-0!"
              classNames={{
                body: "pt-2!",
              }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={handleActiveTab}
                items={[
                  {
                    key: "introduce",
                    label: (
                      <span style={{ fontSize: "16px", fontWeight: 600 }}>
                        <MedicineBoxOutlined className="mr-2" />
                        Giới thiệu
                      </span>
                    ),
                    children: (
                      <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                      >
                        <div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: data?.description ?? "",
                            }}
                          ></div>
                        </div>
                      </Space>
                    ),
                  },
                  {
                    key: "sepcility",
                    label: (
                      <span style={{ fontSize: "16px", fontWeight: 600 }}>
                        <UserOutlined className="mr-2" />
                        Chuyên khoa & Bác sĩ
                      </span>
                    ),
                    children: <TabDepartment facilityId={Number(id)} />,
                  },
                ]}
              />
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default FacilityDetail;
