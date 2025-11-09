import type { CollapseProps } from "antd";
import { Button, Collapse, Flex } from "antd";
import { forwardRef, useRef } from "react";
import {
  HospitalScheduleModal,
  type HospitalScheduleRef,
} from "./modal/modal-schedule-facility";
import { v4 } from "uuid";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const subitems: CollapseProps["items"] = [
  {
    key: v4(),
    label: "This is panel header 1",
    children: <p>{text}</p>,
  },
  {
    key: v4(),
    label: "This is panel header 2333",
    children: <p>{text}</p>,
  },
  {
    key: v4(),
    label: "This is panel header 1113",
    children: <p>{text}</p>,
  },
  {
    key: v4(),
    label: "This is panel header 999993",
    children: <p>{text}</p>,
  },
  {
    key: v4(),
    label: "This is panel header 55553",
    children: <p>{text}</p>,
  },
  {
    key: v4(),
    label: "This is panel header 555",
    children: <p>{text}</p>,
  },
  {
    key: v4(),
    label: "This is panel header 4",
    children: <p>{text}</p>,
  },
];

const items: CollapseProps["items"] = [
  {
    key: v4(),
    label: "This is panel header 1",
    children: <Collapse accordion items={subitems} />,
  },
  {
    key: v4(),
    label: "This is panel header 2333",
    children: <Collapse accordion items={subitems} />,
  },
  {
    key: v4(),
    label: "This is panel header 1113",
    children: <Collapse accordion items={subitems} />,
  },
  {
    key: v4(),
    label: "This is panel header 999993",
    children: <Collapse accordion items={subitems} />,
  },
  {
    key: v4(),
    label: "This is panel header 55553",
    children: <Collapse accordion items={subitems} />,
  },
  {
    key: v4(),
    label: "This is panel header 555",
    children: <Collapse accordion items={subitems} />,
  },
  {
    key: v4(),
    label: "This is panel header 4",
    children: <Collapse accordion items={subitems} />,
  },
];

interface IProps {}

const SpecialtyFacility = forwardRef<HTMLDivElement, IProps>(({}, ref) => {
  const hospitalScheduleModalRef = useRef<HospitalScheduleRef>(null);

  return (
    <>
      <div
        ref={ref}
        data-section="specialtyFacility"
        className="bg-white rounded-md p-5.5"
      >
        <Flex gap={10} align="center" justify="space-between" className="mb-5!">
          <Flex gap={10} align="center">
            <div className="h-6 w-[5px] bg-amber-200 rounded" />
            <h3 className="text-xl font-semibold">Chuyên khoa</h3>
          </Flex>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => hospitalScheduleModalRef.current?.showModal()}
          >
            Thêm mới
          </Button>
        </Flex>
        <Collapse accordion items={items} />
      </div>
      <HospitalScheduleModal ref={hospitalScheduleModalRef} />
    </>
  );
});

export default SpecialtyFacility;
