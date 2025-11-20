"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { PATH_ROUTE } from "../lib/enums/path";
import { formatSlug } from "../../../helpers/format-path-breadcrumd";

export function BreadcrumbPath() {
  const location = useLocation(); // ✅ Theo dõi URL động
  const paths = location.pathname.split("/").filter(Boolean);

  const generateHref = (index: number) =>
    "/" + paths.slice(0, index + 1).join("/");
  const nav = useNavigate();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Trang chủ */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <div
              className="font-bold text-[30px] text-[#5ca2b9] flex-1 cursor-pointer"
              onClick={() => nav(`${PATH_ROUTE.HOME}`)}
            >
              Booking Care
            </div>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Các path động */}
        {paths.map((segment, index) => {
          const href = generateHref(index);
          const isLast = index === paths.length - 1;
          const label = formatSlug(segment);

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <span onClick={() => nav(href)}>{label}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
