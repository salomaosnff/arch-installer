import { defineConfig, presetWebFonts, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetWebFonts({
      fonts: {
        sans: 'Ubuntu'
      }
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives()
  ],
})