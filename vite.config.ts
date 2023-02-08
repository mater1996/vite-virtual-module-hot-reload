import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const VIRTUAL_MODULE_ID_1 = 'VIRTUAL_MODULE_ID_1'
const VIRTUAL_MODULE_ID_2 = 'VIRTUAL_MODULE_ID_2'
const VIRTUAL_MODULE_ID_3 = 'VIRTUAL_MODULE_ID_3'
const VIRTUAL_MODULE_ID_4 = 'VIRTUAL_MODULE_ID_4'
const VIRTUAL_MODULE_ID_5 = 'VIRTUAL_MODULE_ID_5'

const code = {
  [VIRTUAL_MODULE_ID_1]:
    'export default function(){ console.log("VIRTUAL_MODULE_ID_1") }',
  [VIRTUAL_MODULE_ID_2]:
    'export default function(){ console.log("VIRTUAL_MODULE_ID_2") }',
  [VIRTUAL_MODULE_ID_3]:
    'export default function(){ console.log("VIRTUAL_MODULE_ID_3") }',
  [VIRTUAL_MODULE_ID_4]:
    'export default function(){ console.log("VIRTUAL_MODULE_ID_4") }',
  [VIRTUAL_MODULE_ID_5]:
    'export default function(){ console.log("VIRTUAL_MODULE_ID_5") }'
}

function ViteAbcPlugin(): Plugin {
  return {
    name: 'vite-abc-plugin',

    handleHotUpdate(ctx) {
      const module1 = ctx.server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID_1)
      const module2 = ctx.server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID_2)
      const module3 = ctx.server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID_3)
      const module4 = ctx.server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID_4)
      const module5 = ctx.server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID_5)
      // ctx.server.reloadModule('name', [module1, module2, module3, module4, module5])
      module1 && ctx.server.reloadModule(module1)
      module2 && ctx.server.reloadModule(module2)
      module3 && ctx.server.reloadModule(module3)
      module4 && ctx.server.reloadModule(module4)
      module5 && ctx.server.reloadModule(module5)
    },

    resolveId(id) {
      if (
        id === VIRTUAL_MODULE_ID_1 ||
        id === VIRTUAL_MODULE_ID_2 ||
        id === VIRTUAL_MODULE_ID_3 ||
        id === VIRTUAL_MODULE_ID_4 ||
        id === VIRTUAL_MODULE_ID_5
      ) {
        return id
      }
      return
    },

    load(id) {
      if (
        id === VIRTUAL_MODULE_ID_1 ||
        id === VIRTUAL_MODULE_ID_2 ||
        id === VIRTUAL_MODULE_ID_3 ||
        id === VIRTUAL_MODULE_ID_4 ||
        id === VIRTUAL_MODULE_ID_5
      ) {
        return code[id]
      }
      return
    },

    transform(code, id) {
      if (/.abc$/.test(id)) {
        return `
          import module1 from "VIRTUAL_MODULE_ID_1"
          import module2 from "VIRTUAL_MODULE_ID_2"
          import module3 from "VIRTUAL_MODULE_ID_3"
          import module4 from "VIRTUAL_MODULE_ID_4"
          import module5 from "VIRTUAL_MODULE_ID_5"

          module1()
          module2()
          module3()
          module4()
          module5()

          export default "${code}"
      `
      }
      return
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), ViteAbcPlugin()]
})
