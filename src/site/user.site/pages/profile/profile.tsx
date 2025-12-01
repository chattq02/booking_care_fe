import { Layout, Tabs, Avatar } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  HistoryOutlined,
  MailOutlined,
} from "@ant-design/icons";

import InfoUser from "./components/info-user";
import { useAtomValue } from "jotai";
import { userAtom } from "@/stores/auth";
import MyAppointment from "./components/tab-my-appointment";
import { useSearchParams } from "react-router-dom";
import TabHistoryAppointment from "./components/tab-history-appointment";

const { Content } = Layout;

export default function Profile() {
  const infoUser = useAtomValue(userAtom);
  const [searchParams, setSearchParams] = useSearchParams();

  const validTabs = ["info", "my-appointment", "history-appointment"];

  const tabFromUrl = searchParams.get("tab");
  const activeTab = validTabs.includes(tabFromUrl || "") ? tabFromUrl! : "info";

  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  // Tab items configuration
  const tabItems = [
    {
      key: "info",
      label: (
        <span className="flex items-center font-semibold text-sm lg:text-base">
          <UserOutlined className="mr-1 lg:mr-2" />
          <span className="hidden sm:inline">Thông tin cá nhân</span>
        </span>
      ),
      children: <InfoUser />,
    },
    {
      key: "my-appointment",
      label: (
        <span className="flex items-center font-semibold text-sm lg:text-base">
          <CalendarOutlined className="mr-1 lg:mr-2" />
          <span className="hidden sm:inline">Lịch khám của tôi</span>
        </span>
      ),
      children: <MyAppointment />,
    },
    {
      key: "history-appointment",
      label: (
        <span className="flex items-center font-semibold text-sm lg:text-base">
          <HistoryOutlined className="mr-1 lg:mr-2" />
          <span className="hidden sm:inline">Lịch sử khám</span>
          <span className="sm:hidden">Lịch sử</span>
        </span>
      ),
      children: <TabHistoryAppointment />,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Content className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-420 mx-auto">
          {/* Sidebar Profile - Fixed */}

          <div className="bg-linear-to-b from-blue-600 to-purple-700 text-white p-6 lg:p-8 lg:fixed top-24 left-4 right-4 lg:left-auto lg:right-auto lg:w-64 lg:rounded-md rounded-t-md z-10">
            <div className="text-center">
              <Avatar
                size={120}
                icon={<UserOutlined />}
                className="border-4 border-white/20 shadow-2xl mb-4 bg-white/10 mx-auto"
              />
              <h2 className="text-xl font-bold mb-1">
                {infoUser?.fullName ?? ""}
              </h2>
              <p className="text-blue-100 mb-4 flex items-center justify-center">
                <MailOutlined className="mr-2" />
                {infoUser?.email ?? ""}
              </p>
            </div>
          </div>

          {/* Main Content - Adjusted for fixed sidebar */}
          <div className="lg:ml-70 bg-white lg:px-5 px-5 rounded-b-md lg:rounded-md">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={tabItems}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
