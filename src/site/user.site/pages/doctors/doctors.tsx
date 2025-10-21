import { v4 } from "uuid";
import { DoctorCard } from "./components/doctor-card";

export default function Doctors() {
  return (
    <div className="flex flex-1 flex-col gap-4 pb-4">
      <div className="relative">
        <img
          src="https://tiemchunglongchau.com.vn/img/bg-doctor-page.webp?w=2560&q=90"
          alt=""
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col text-center justify-center gap-4 px-4">
          <h4 className="text-[40px] text-[#101519] font-semibold">
            Đội ngũ chuyên môn của bệnh viện
          </h4>
          <p className="text-[#455768] text-[16px] font-normal">
            Đội ngũ bác sĩ, dược sĩ giàu kinh nghiệm có thâm niên trong ngành,
            được tu nghiệp cả trong và ngoài nước.
          </p>
        </div>
      </div>
      <div className="grid auto-rows-min gap-3 md:grid-cols-3 px-10 py-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-xl">
            <DoctorCard
              id={v4()}
              name="Nguyễn Văn My"
              specialty="Truyền nhiễm"
              imageUrl="https://img5.thuthuatphanmem.vn/uploads/2021/11/20/anh-cute-nguoi-that-dep-nhat_022606213.jpg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
