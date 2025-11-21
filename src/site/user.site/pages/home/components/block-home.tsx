import { Button } from "antd";
import { ChevronRight } from "lucide-react";
import React from "react";

interface IProps {
  children: React.ReactNode;
  onClickViewMore?: () => void;
  title: string;
  description?: string;
}

export default function BlockHome({
  children,
  onClickViewMore,
  title,
  description,
}: IProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <div className="w-full sm:w-auto">
          <div className="flex items-center mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
          </div>
          {description && (
            <p className="text-gray-600 text-base sm:text-lg">{description}</p>
          )}
        </div>
        <Button
          onClick={onClickViewMore}
          type="primary"
          size="middle"
          className="bg-linear-to-r rounded-full! from-green-500 to-blue-500 border-0 hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
        >
          Xem thêm
          <div>
            <ChevronRight size={18} />
          </div>
        </Button>
      </div>
      {children}
    </>
  );
}
