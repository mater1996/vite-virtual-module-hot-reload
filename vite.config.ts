import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const VIRTUAL_MODULE_IDS = new Array(5)
  .fill('')
  .map((v, k) => `VIRTUAL_MODULE_ID_${k}`)

const code = Object.fromEntries(
  VIRTUAL_MODULE_IDS.map(v => [
    v,
    `export default function() { console.log("${v}") }`
  ])
)

function ViteVuePrePlugin(): Plugin {
  return {
    name: 'vite-vue-pre-plugin',

    handleHotUpdate(ctx) {
      VIRTUAL_MODULE_IDS.forEach(v => {
        const module = ctx.server.moduleGraph.getModuleById(v)
        module && ctx.server.reloadModule(module)
      })
    },

    resolveId(id) {
      if (VIRTUAL_MODULE_IDS.includes(id)) {
        return id
      }
    },

    load(id) {
      if (VIRTUAL_MODULE_IDS.includes(id)) {
        return code[id]
      }
    },

    transform(code, id) {
      if (/App\.vue$/.test(id)) {
        return code.replace(
          /(<script(.)+>)/,
          `$1
${VIRTUAL_MODULE_IDS.map((v, k) => `import module${k} from "${v}"`).join('\n')}
${VIRTUAL_MODULE_IDS.map((v, k) => `module${k}()`).join('\n')}\n`
        )
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ViteVuePrePlugin(), vue()]
})
