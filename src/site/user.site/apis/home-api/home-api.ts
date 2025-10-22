import { v4 } from "uuid";
import type { HomeBannerType } from "./home-type";

export const homeApi = {
  getBannerHome: (): HomeBannerType[] => {
    return [
      {
        id: v4(),
        imageUrl:
          "https://cdn.tiemchunglongchau.com.vn/unsafe/828x0/filters:quality(90)/Web_PC_1_96bf3e05b0.png",
        name: "slide 1",
        link: "#",
      },
      {
        id: v4(),
        imageUrl:
          "https://cdn.tiemchunglongchau.com.vn/unsafe/828x0/filters:quality(90)/BANNER_WEB_PC_f01b21042c.png",
        name: "slide 2",
        link: "#",
      },
      {
        id: v4(),
        imageUrl:
          "https://cdn.tiemchunglongchau.com.vn/unsafe/828x0/filters:quality(90)/PC_808_X298_2_88cbcd0add.png",
        name: "slide 3",
        link: "#",
      },
    ];
  },
};
