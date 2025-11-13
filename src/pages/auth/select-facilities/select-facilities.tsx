import { useGetListFacility } from "../hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import {
  LogOut,
  Building2,
  UserCheck,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import { Avatar as AvatarATD, List } from "antd";
import { useState } from "react";

export default function SelectFacilities() {
  const [selectedRole, setSelectedRole] = useState<number | null>(0);

  const { data } = useGetListFacility();

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const user = {
    name: "Mạnh Quỳnh Đỗ",
    email: "trieunguyet66+117@yahoo.com",
    avatar:
      "https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645.jpg",
    roles: ["admin", "doctor"], // User có cả 2 quyền
  };

  // Danh sách quyền có thể chọn
  const availableRoles = data?.roles.map((val, index) => {
    const isAdmin = val.role === "ADMIN";
    return {
      id: index,
      name: isAdmin ? "Quản trị viên" : "Bác sĩ",
      icon: isAdmin ? Shield : Stethoscope,
      description: isAdmin
        ? "Quản lý hệ thống, người dùng và cấu hình"
        : "Khám bệnh, quản lý lịch trình bệnh nhân",
      color: isAdmin
        ? "bg-purple-100 text-purple-800 border-purple-200"
        : "bg-blue-100 text-blue-800 border-blue-200",
    };
  });

  const handleRoleSelect = (roleId: string) => {
    // setSelectedRole(roleId);
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "doctor":
        return <Stethoscope className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  // Xác định grid class dựa trên số lượng roles
  const getGridClass = () => {
    const roleCount = availableRoles?.length || 0;

    if (roleCount === 1) {
      return "grid-cols-1 max-w-md";
    } else if (roleCount === 2) {
      return "grid-cols-1 md:grid-cols-2 max-w-2xl";
    } else if (roleCount === 3) {
      return "grid-cols-1 md:grid-cols-3 max-w-4xl";
    } else if (roleCount >= 4) {
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-6xl";
    }

    return "grid-cols-1 max-w-2xl";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 border-b px-4 z-10 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">
            Chọn cơ sở làm việc
          </span>
        </div>
        <div className="ml-auto px-3">
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm">
                  <Avatar className="h-8 w-8 border-2 border-blue-200">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                      {user?.name ? getUserInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-48"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Chào mừng trở lại, {user.name}!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vui lòng chọn vai trò và cơ sở y tế mà bạn muốn làm việc.
            </p>
          </div>

          {/* Role Selection */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Chọn vai trò làm việc
              </h2>
            </div>

            <div className={`grid ${getGridClass()} gap-4 mx-auto`}>
              {availableRoles?.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    // onClick={() => handleRoleSelect(role.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${role.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {role.name}
                      </span>
                      {isSelected && (
                        <div className="ml-auto bg-blue-500 text-white p-1 rounded-full">
                          <UserCheck className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Facilities List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mx-auto">
            <List
              itemLayout="horizontal"
              dataSource={data?.facilities}
              renderItem={(item) => (
                <List.Item className="px-4! hover:bg-gray-100 transition-all duration-200 border-b border-gray-100 last:border-b-0 cursor-pointer">
                  <List.Item.Meta
                    avatar={
                      <AvatarATD
                        src={
                          "https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645.jpg"
                        }
                        className="h-[70px]! w-[70px]! border-2! border-blue-300! shadow-sm"
                      />
                    }
                    title={
                      <div className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </div>
                    }
                    description={
                      <div className="space-y-2">
                        <div className="text-gray-600">{item.address}</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {data?.roles?.map((val) => (
                            <div
                              key={val.role}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                val.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {getRoleIcon(val.role)}
                              <span>
                                {val.role === "ADMIN" ? "Quản trị" : "Bác sĩ"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
              className="w-full"
              locale={{
                emptyText: data?.facilities?.length === 0 && "Không có dữ liệu",
              }}
            />
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Không thấy cơ sở hoặc vai trò phù hợp?{" "}
              <button className="text-blue-600 hover:text-blue-700 font-medium underline">
                Liên hệ quản trị viên
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
