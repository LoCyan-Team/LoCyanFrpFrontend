export default defineNuxtPlugin(() => {
  async function copyToClipboard(text: string): Promise<boolean> {
    const notification = window.$notification;

    if (!notification) {
      throw new TypeError("Call before Dialog API provided.");
    }
    if (navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        notification.success({
          title: "复制成功",
          content: "内容已成功复制到剪贴板！",
          duration: 2500,
        });
        return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("复制失败:", error);
        notification.error({
          title: "复制失败",
          content: error.message || "复制内容到剪贴板失败，请重试。",
          duration: 2500,
        });
        return false;
      }
    } else {
      notification.warning({
        title: "不支持的浏览器",
        content: "您的浏览器不支持剪贴板 API，无法进行复制操作。",
        duration: 2500,
      });
      return false;
    }
  }

  return {
    provide: {
      copyToClipboard: copyToClipboard,
    },
  };
});
