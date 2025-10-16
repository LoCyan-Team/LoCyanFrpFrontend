import { NIcon } from "naive-ui";
import { ClientOnly } from "#components";

export function renderIcon(icon: Component) {
  return () =>
    h(ClientOnly, null, {
      default: () => h(NIcon, null, { default: () => h(icon) }),
    });
}
