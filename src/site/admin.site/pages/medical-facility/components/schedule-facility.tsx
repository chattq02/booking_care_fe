import { Button, Flex, Timeline } from "antd";
import { forwardRef, useRef } from "react";
import {
  HospitalScheduleModal,
  type HospitalScheduleRef,
} from "./modal/modal-schedule-facility";

interface IProps {}

const ScheduleFacility = forwardRef<HTMLDivElement, IProps>(({}, ref) => {
  const hospitalScheduleModalRef = useRef<HospitalScheduleRef>(null);

  return (
    <>
      <div
        ref={ref}
        data-section="scheduleFacility"
        className="bg-white rounded-md p-5.5"
      >
        <Flex gap={10} align="center" justify="space-between" className="mb-5!">
          <Flex gap={10} align="center">
            <div className="h-6 w-[5px] bg-amber-200 rounded" />
            <h3 className="text-xl font-semibold">Thông tin lịch làm việc</h3>
          </Flex>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => hospitalScheduleModalRef.current?.showModal()}
          >
            Điều chỉnh
          </Button>
        </Flex>

        <Timeline
          items={[
            {
              color: "green",
              children: "Create a services site 2015-09-01",
            },
            {
              color: "green",
              children: "Create a services site 2015-09-01",
            },
            {
              color: "red",
              children: (
                <>
                  <p>Solve initial network problems 1</p>
                  <p>Solve initial network problems 2</p>
                  <p>Solve initial network problems 3 2015-09-01</p>
                </>
              ),
            },
            {
              children: (
                <>
                  <p>Technical testing 1</p>
                  <p>Technical testing 2</p>
                  <p>Technical testing 3 2015-09-01</p>
                </>
              ),
            },
            {
              color: "gray",
              children: (
                <>
                  <p>Technical testing 1</p>
                  <p>Technical testing 2</p>
                  <p>Technical testing 3 2015-09-01</p>
                </>
              ),
            },
            {
              color: "gray",
              children: (
                <>
                  <p>Technical testing 1</p>
                  <p>Technical testing 2</p>
                  <p>Technical testing 3 2015-09-01</p>
                </>
              ),
            },
          ]}
        />
      </div>
      <HospitalScheduleModal ref={hospitalScheduleModalRef} />
    </>
  );
});

export default ScheduleFacility;
