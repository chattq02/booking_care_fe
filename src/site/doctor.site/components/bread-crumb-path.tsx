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
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { formatSlug } from "@/helpers/format-path-breadcrumd";
import { without } from "lodash";
import { PATH_ROUTE_DOCTOR } from "../lib/enums/path";

export function BreadcrumbPath() {
  const location = useLocation(); // ✅ Theo dõi URL động
  const paths = location.pathname.split("/").filter(Boolean);
  const params = useParams();
  const { id } = params;

  const result = without(paths, id);
  const generateHref = (index: number) =>
    "/" + result.slice(0, index + 1).join("/");
  const nav = useNavigate();
  const getDisplayLabel = (segment: string) => {
    const baseLabel = formatSlug(segment);

    return baseLabel;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Trang chủ */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <span
              className="cursor-pointer"
              onClick={() => nav(`${PATH_ROUTE_DOCTOR.HOME}`)}
            >
              Trang chủ
            </span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Các path động */}
        {result.map((segment, index) => {
          const href = generateHref(index);
          const isLast = index === result.length - 1;
          const label = getDisplayLabel(decodeURIComponent(segment ?? ""));

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
