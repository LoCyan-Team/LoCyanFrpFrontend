export const useClipboard = () => {
  /**
   * 复制文本到剪贴板
   * @param content 需要复制的内容
   */
  async function copy(content: string): Promise<boolean> {
    if (import.meta.server) return false;

    // @ts-expect-error
    const notification = window.$notification;

    if (!notification) {
      console.warn("Notification API is not available on window.");
    }

    if (navigator?.clipboard) {
      return await navigator.clipboard
        .writeText(content)
        .then(() => {
          notification?.success({
            title: "复制成功",
            content: "内容已成功复制到剪贴板！",
            duration: 2500,
          });
          return true;
        })
        .catch((e) => {
          notification?.success({
            title: "复制失败",
            content: `发生错误: ${e}`,
            duration: 2500,
          });
          return false;
        });
    } else {
      notification?.warning({
        title: "不支持的浏览器",
        content: "您的浏览器不支持剪贴板 API，无法进行复制操作。",
        duration: 2500,
      });
      return false;
    }
  }

  return {
    copy,
  };
};
