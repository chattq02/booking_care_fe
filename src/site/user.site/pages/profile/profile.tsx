"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  email: z.string().email(),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
});

export default function Profile() {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "Chất",
      lastName: "Trịnh Quang",
      email: "chattq@solashi.com",
      phone: "0787267411",
    },
  });

  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <div className="container py-6 space-y-6">
      <Tabs defaultValue="user-info">
        <TabsList>
          <TabsTrigger value="user-info">Thông tin người dùng</TabsTrigger>
          <TabsTrigger value="examination-schedule">Lịch khám</TabsTrigger>
          <TabsTrigger value="medical-history">Lịch sử khám</TabsTrigger>
          <TabsTrigger value="pay-history">Lịch sử thanh toán</TabsTrigger>
        </TabsList>

        <TabsContent value="user-info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="flex flex-col items-center justify-center py-6">
              <Avatar className="w-28 h-28 mb-3">
                <AvatarImage src="/placeholder.jpg" />
                <AvatarFallback>CT</AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500 text-center mb-2">
                Kích thước file tối đa 1MB
                <br />
                Định dạng: JPEG, PNG...
              </p>
              <Button>Cập nhật ảnh đại diện</Button>
            </Card>

            <Card className="col-span-2">
              <CardHeader>Thông tin người dùng</CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lastName">Họ</Label>
                      <Input {...form.register("lastName")} />
                    </div>
                    <div>
                      <Label htmlFor="firstName">Tên</Label>
                      <Input {...form.register("firstName")} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input {...form.register("email")} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input {...form.register("phone")} />
                    </div>
                  </div>

                  <Button type="submit" className="mt-4">
                    Xác nhận
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
