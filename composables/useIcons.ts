// 图标按需加载的 composable
export const useIcons = () => {
  // 直接返回动态导入函数，避免预先定义所有图标
  const loadIcon = async (iconName: string, packageName: string) => {
    try {
      const module = await import(`@vicons/${packageName}`)
      return module[iconName]
    } catch (error) {
      console.warn(`Failed to load icon ${iconName} from @vicons/${packageName}:`, error)
      return null
    }
  }

  // 常用图标的快捷方法
  const loadIonicons4 = (iconName: string) => loadIcon(iconName, 'ionicons4')
  const loadIonicons5 = (iconName: string) => loadIcon(iconName, 'ionicons5')
  const loadCarbon = (iconName: string) => loadIcon(iconName, 'carbon')
  const loadFluent = (iconName: string) => loadIcon(iconName, 'fluent')
  const loadMaterial = (iconName: string) => loadIcon(iconName, 'material')

  return {
    loadIcon,
    loadIonicons4,
    loadIonicons5,
    loadCarbon,
    loadFluent,
    loadMaterial
  }
}