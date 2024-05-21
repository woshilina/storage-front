import { useUserStore } from '@/stores/user'

const permission = {
  mounted: (el, binding, vnode) => {
    const store = useUserStore()
    const { value } = binding
    const permissions = store.getUserPermissions()
    if (value) {
      const hasPermission = permissions.some((permission) => value === permission)
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
export default {
  install(app) {
    app.directive('permission', permission)
  }
}
