export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.component("highcharts", {
      render: () => null, // 服务端渲染为空，不生成 HTML
    });
    return;
  }

  if (import.meta.client) {
    const HighchartsVue = await import("highcharts-vue");
    await import("highcharts/modules/accessibility");

    nuxtApp.vueApp.use(HighchartsVue.default);
  }
});
