import { Window } from '@tauri-apps/api/window'
interface TitleOptions {
  title?: string
  titleTemplate?: (title: string) => string
}

export function useWindowTitle(options: TitleOptions) {
  const { title, titleTemplate: newTitleTemplate } = options

  if (typeof newTitleTemplate === 'function') {
    provide('window.title.template', newTitleTemplate)
  }

  const titleTemplate = newTitleTemplate ?? inject('window.title.template', (title: string) => title)

  const window = Window.getCurrent()
  const titleRef = computed(() => titleTemplate(toValue(title) ?? ''))

  watchEffect(() => {
    window.setTitle(titleRef.value).catch((error) => {
      console.error('Failed to set window title:', error)
    })
  })
}