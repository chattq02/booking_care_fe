import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/helpers/helper";
import { useGetListDepartment } from "@/site/admin.site/pages/specialty/hooks/use-specialty";
import type { ResponseDepartment } from "@/site/admin.site/pages/specialty/type";
import { Button, Card, Empty, Flex, Spin, Typography } from "antd";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListDoctorDepartment from "./list-doctor-department";

interface IProps {
  facilityId: number;
}

const { Title, Text } = Typography;

export default function TabDepartment({ facilityId }: IProps) {
  const [openSpecialty, setOpenSpecialty] = useState<number | null | undefined>(
    null
  );
  const [departmentId, setDepartmentID] = useState<number | null | undefined>(
    null
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const { data: listDepartment, isLoading } = useGetListDepartment({
    keyword: "",
    page: 1,
    per_page: 200,
    facilityId: Number(facilityId),
  });

  // Xử lý khi load page - kiểm tra param và scroll đến khoa
  useEffect(() => {
    const departmentParam = searchParams.get("department");
    if (departmentParam && listDepartment?.data) {
      const departmentId = Number(departmentParam);
      const department = listDepartment.data.find(
        (dept) => dept.id === departmentId
      );

      if (department) {
        setOpenSpecialty(departmentId);
        setDepartmentID(departmentId);

        // Delay scroll để đảm bảo DOM đã render
        setTimeout(() => {
          const cardElement = cardRefs.current.get(departmentId);
          if (cardElement) {
            cardElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            // Highlight card
            cardElement.style.boxShadow = "0 0 0 2px #1890ff";
            setTimeout(() => {
              cardElement.style.boxShadow = "";
            }, 2000);
          }
        }, 100);
      }
    }
  }, [listDepartment?.data, searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-32">
        <Spin spinning />
      </div>
    );
  }

  const handleClickViewDoctor = (
    isOpen: boolean,
    specialty: ResponseDepartment
  ) => {
    setDepartmentID(specialty?.id);
    setOpenSpecialty(isOpen ? null : specialty?.id);

    // Cập nhật URL param
    const newSearchParams = new URLSearchParams(searchParams);
    if (!isOpen) {
      newSearchParams.set("department", Number(specialty?.id).toString());
    } else {
      newSearchParams.delete("department");
    }
    setSearchParams(newSearchParams);
  };

  // Hàm để gán ref cho từng card
  const setCardRef = (
    element: HTMLDivElement | null,
    id: number | undefined
  ) => {
    if (element) {
      cardRefs.current.set(Number(id), element);
    } else {
      cardRefs.current.delete(Number(id));
    }
  };

  return (
    <div className="max-h-[700px] overflow-y-auto">
      {listDepartment?.data && listDepartment?.data?.length > 0 ? (
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          {listDepartment.data.map((specialty) => {
            const isOpen = openSpecialty === specialty.id;

            return (
              <div
                key={specialty.id}
                ref={(el) => setCardRef(el, specialty.id)}
                className="transition-all duration-300"
              >
                <Card
                  className="border border-gray-200 rounded-xl sm:rounded-2xl bg-white overflow-hidden hover:shadow-md sm:hover:shadow-lg transition-all duration-300"
                  classNames={{
                    body: "p-0!",
                  }}
                >
                  {/* Header */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start w-full">
                      {/* Avatar - Căn giữa trên mobile, căn trái trên tablet+ */}
                      <div className="flex justify-center sm:justify-start w-full sm:w-auto">
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover shrink-0">
                          <AvatarImage
                            src={specialty.imageUrl ?? ""}
                            alt={specialty.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg text-xl sm:text-2xl font-bold bg-cyan-50 text-cyan-600 flex items-center justify-center">
                            {getFirstLetter(specialty.name ?? "")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Content - Chiếm không gian còn lại */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex flex-col gap-2 text-center sm:text-left">
                          {/* Tên chuyên khoa - Cho phép xuống 2 dòng */}
                          <Title
                            level={4}
                            className="m-0 text-gray-900 text-lg sm:text-xl line-clamp-2 wrap-break-word leading-tight"
                          >
                            {specialty.name}
                          </Title>

                          {/* Mô tả - Giới hạn 3 dòng */}
                          <Text className="text-gray-600 leading-relaxed line-clamp-3 text-sm sm:text-base wrap-break-word">
                            {specialty.description}
                          </Text>
                        </div>
                      </div>

                      {/* Collapse Button - Căn giữa trên mobile, căn phải trên tablet+ */}
                      <div className="flex justify-center sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                        <Button
                          type="text"
                          onClick={() =>
                            handleClickViewDoctor(isOpen, specialty)
                          }
                          className="font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                        >
                          {isOpen ? (
                            <Flex align="center" gap={8}>
                              <span>Thu gọn</span>
                              <ChevronUpIcon className="h-4 w-4 shrink-0" />
                            </Flex>
                          ) : (
                            <Flex align="center" gap={8}>
                              <span>Xem bác sĩ</span>
                              <ChevronDownIcon className="h-4 w-4 shrink-0" />
                            </Flex>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Doctors Section - Collapsible */}
                  {isOpen && (
                    <ListDoctorDepartment
                      facilityId={facilityId}
                      departmentId={departmentId}
                    />
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty
          description="Không tìm thấy chuyên khoa hoặc bác sĩ phù hợp"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-10"
        />
      )}
    </div>
  );
}
