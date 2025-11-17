import { useState } from "react";
import { Select, Button, Flex } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import SearchBox from "../../info-doctor/components/search-box";
import { useGetListDepartment } from "../../specialty/hooks/use-specialty";
import { useParams } from "react-router-dom";
import CalendarTask from "./calendar-task";

export default function TaskSchedule() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [keyWord, setKeyWord] = useState("");

  const { id } = useParams();
  const { data: listDepartment } = useGetListDepartment({
    keyword: "",
    page: 1,
    per_page: 150,
    facilityId: Number(id),
  });
  const getWeekStart = (date: Dayjs) => {
    const day = date.day();
    const diff = day === 0 ? 6 : day - 1;
    return date.subtract(diff, "day");
  };

  const weekStart = getWeekStart(currentDate);
  const [selectedDepartment, setSelectedDepartment] = useState<
    number | undefined
  >(undefined);

  const handlePrevWeek = () => {
    setCurrentDate(currentDate.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setCurrentDate(currentDate.add(1, "week"));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  return (
    <div className="bg-white rounded-md p-5.5">
      <Flex gap={10} align="center" className="mb-5!" justify="space-between">
        <Flex gap={10} align="center">
          <div className="h-6 w-[5px] bg-[#9afaeb] rounded" />
          <h3 className="text-xl font-semibold" data-section="listDoctor">
            Lịch hẹn khám bệnh
          </h3>
        </Flex>
      </Flex>
      <div className="max-w-full mx-auto">
        {/* Header Controls */}
        <div className="bg-white">
          <Flex justify="space-between">
            <Flex align="center" gap={15}>
              <SearchBox
                value={keyWord}
                onSearch={(value) => setKeyWord(value)}
              />
              <Select
                value={selectedDepartment || undefined}
                onChange={setSelectedDepartment}
                style={{ width: 250 }}
                placeholder="Chọn chuyên khoa"
                popupMatchSelectWidth={false}
                options={
                  listDepartment?.data.map((val) => {
                    return {
                      label: val.name,
                      value: val.id,
                    };
                  }) || []
                }
                showSearch
                optionFilterProp="label"
              />
            </Flex>
            <Flex
              align="center"
              gap={15}
              className="text-gray-700 font-bold text-[16px]"
            >
              <Button type="default" onClick={handleToday}>
                Hôm nay
              </Button>
              <Button
                onClick={handlePrevWeek}
                icon={<ChevronLeft size={14} />}
              ></Button>
              {weekStart.format("DD/MM/YYYY")} -{" "}
              {weekStart.add(6, "day").format("DD/MM/YYYY")}
              <Button
                onClick={handleNextWeek}
                icon={<ChevronRight size={14} />}
              ></Button>
            </Flex>
          </Flex>
        </div>

        {/* Calendar Grid Container */}
        <CalendarTask
          currentDate={currentDate}
          keyWord={keyWord}
          departmentId={selectedDepartment}
        />
      </div>
    </div>
  );
}
