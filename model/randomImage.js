import axios from "axios";
import { getImageList } from "./index.js";

async function getImageCollection(name = "") {
  const dataList = await getImageList();

  if (!dataList) {
    console.error("获取图片失败");
    return null;
  }

  if (name) {
    const selectedItem = dataList.find(
      (item) => item.name === name || item.alias === name,
    );
    if (!selectedItem) {
      console.error("获取图片失败");
    }
    return selectedItem || null;
  }

  return dataList[Math.floor(Math.random() * dataList.length)];
}

async function fetchImages(alias, count) {
  const apiUrl = `https://img.wuliya.cn/api/${alias}?type=json&num=1`;

  const requests = Array.from({ length: count }, () =>
    axios.get(apiUrl, { timeout: 20000 }),
  );
  const responses = await Promise.allSettled(requests);

  if (
    !responses.some(
      (response) =>
        response.status === "fulfilled" && response.value.data.code === 200,
    )
  ) {
    console.error("获取图片失败");
    return [];
  }

  return responses
    .filter(
      (response) =>
        response.status === "fulfilled" && response.value.data.code === 200,
    )
    .flatMap((response) => response.value.data.data);
}

export async function getRandomImages(name = "", count = 1) {
  const selectedItem = await getImageCollection(name);

  if (!selectedItem) {
    console.error("获取图片失败");
    return { code: 400 };
  }

  const images = await fetchImages(selectedItem.alias, count);

  if (images.length > 0) {
    return { code: 200, images };
  } else {
    console.error("获取图片失败");
    return { code: 400 };
  }
}
