import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Languages, Download, RefreshCw, Smile } from 'lucide-react'

const translations = {
  en: {
    title: 'Favicon Generator',
    subtitle: 'Enter 1-2 characters or an emoji, choose background color, generate and download SVG favicon.',
    textLabel: 'Text or emoji',
    textPlaceholder: 'A, AB, or emoji',
    bgColor: 'Background color',
    textColor: 'Text color',
    size: 'Size',
    shape: 'Shape',
    square: 'Square',
    rounded: 'Rounded',
    circle: 'Circle',
    fontSize: 'Font size',
    download: 'Download SVG',
    preview: 'Preview',
    copyHTML: 'Copy HTML tag',
    copied: 'Copied!',
    fontWeight: 'Font weight',
    normal: 'Normal',
    bold: 'Bold',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Gerador de Favicon',
    subtitle: 'Digite 1-2 caracteres ou emoji, escolha a cor do fundo, gere e baixe o favicon SVG.',
    textLabel: 'Texto ou emoji',
    textPlaceholder: 'A, AB, ou emoji',
    bgColor: 'Cor do fundo',
    textColor: 'Cor do texto',
    size: 'Tamanho',
    shape: 'Forma',
    square: 'Quadrado',
    rounded: 'Arredondado',
    circle: 'Circulo',
    fontSize: 'Tamanho da fonte',
    download: 'Baixar SVG',
    preview: 'Previsualizar',
    copyHTML: 'Copiar tag HTML',
    copied: 'Copiado!',
    fontWeight: 'Peso da fonte',
    normal: 'Normal',
    bold: 'Negrito',
    builtBy: 'Criado por',
  }
} as const

type Lang = keyof typeof translations
type Shape = 'square' | 'rounded' | 'circle'

const PRESETS = [
  { bg: '#6366f1', text: '#ffffff' }, // indigo
  { bg: '#f59e0b', text: '#ffffff' }, // amber
  { bg: '#10b981', text: '#ffffff' }, // emerald
  { bg: '#ef4444', text: '#ffffff' }, // red
  { bg: '#3b82f6', text: '#ffffff' }, // blue
  { bg: '#8b5cf6', text: '#ffffff' }, // violet
  { bg: '#ec4899', text: '#ffffff' }, // pink
  { bg: '#14b8a6', text: '#ffffff' }, // teal
  { bg: '#1e1e2e', text: '#cba6f7' }, // dark purple
  { bg: '#f8fafc', text: '#1e293b' }, // light
]

function generateSVG(text: string, bg: string, fg: string, shape: Shape, fontSize: number, bold: boolean): string {
  const size = 100
  let clipPath = ''
  if (shape === 'rounded') clipPath = `rx="20"`
  if (shape === 'circle') clipPath = `rx="50"`

  const fontSz = Math.round(fontSize * size / 100)
  const fontW = bold ? 'bold' : 'normal'

  const isEmoji = /\p{Emoji}/u.test(text)
  const fontFamily = isEmoji ? 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' : 'Inter, -apple-system, sans-serif'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${bg}" ${clipPath}/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="${fontSz}" font-family="${fontFamily}" font-weight="${fontW}" fill="${fg}">${text}</text>
</svg>`
}

export default function FaviconGenerator() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [text, setText] = useState('G')
  const [bgColor, setBgColor] = useState('#6366f1')
  const [textColor, setTextColor] = useState('#ffffff')
  const [shape, setShape] = useState<Shape>('rounded')
  const [fontSize, setFontSize] = useState(55)
  const [bold, setBold] = useState(true)
  const [copied, setCopied] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const t = translations[lang]

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
  }

  const displayText = text.slice(0, 2) || 'G'
  const svgContent = generateSVG(displayText, bgColor, textColor, shape, fontSize, bold)

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = svgContent
    }
  }, [svgContent])

  const handleDownload = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'favicon.svg'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const handleCopyHTML = () => {
    navigator.clipboard.writeText('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />').then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Smile size={18} className="text-white" />
            </div>
            <span className="font-semibold">Favicon Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/favicon-generator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Controls */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t.textLabel}</label>
                <input type="text" value={text} onChange={e => setText(e.target.value)} maxLength={2}
                  placeholder={t.textPlaceholder}
                  className="w-full px-3 py-2.5 text-2xl rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t.bgColor}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="w-10 h-9 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer" />
                    <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t.textColor}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                      className="w-10 h-9 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer" />
                    <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
              </div>

              {/* Color presets */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Presets</label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p, i) => (
                    <button key={i} onClick={() => { setBgColor(p.bg); setTextColor(p.text) }}
                      style={{ backgroundColor: p.bg, width: 32, height: 32 }}
                      className="rounded-lg border-2 border-transparent hover:border-zinc-400 transition-all flex items-center justify-center text-xs font-bold"
                      title={p.bg}>
                      <span style={{ color: p.text }}>{displayText[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t.shape}</label>
                <div className="flex gap-2">
                  {(['square', 'rounded', 'circle'] as Shape[]).map(s => (
                    <button key={s} onClick={() => setShape(s)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${shape === s ? 'bg-amber-500 border-amber-500 text-white' : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                      {t[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t.fontSize}</label>
                  <span className="text-sm text-zinc-400">{fontSize}%</span>
                </div>
                <input type="range" min={20} max={90} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">{t.fontWeight}</label>
                <button onClick={() => setBold(b => !b)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${bold ? 'bg-amber-500 border-amber-500 text-white' : 'border-zinc-200 dark:border-zinc-700'}`}>
                  {bold ? t.bold : t.normal}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-5">
              <h2 className="font-semibold text-sm">{t.preview}</h2>

              <div className="flex items-center justify-center gap-8 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl p-8">
                {/* Different size previews */}
                {[128, 64, 32, 16].map(sz => (
                  <div key={sz} className="flex flex-col items-center gap-2">
                    <div ref={sz === 128 ? previewRef : undefined} style={{ width: sz, height: sz }}
                      dangerouslySetInnerHTML={sz !== 128 ? { __html: svgContent } : undefined}
                      className="rounded overflow-hidden" />
                    <span className="text-[10px] text-zinc-400">{sz}px</span>
                  </div>
                ))}
              </div>

              {/* SVG code */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">SVG</label>
                <pre className="text-xs font-mono bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3 overflow-auto max-h-40 text-zinc-500 dark:text-zinc-400 whitespace-pre-wrap">{svgContent}</pre>
              </div>

              <div className="flex gap-2">
                <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors">
                  <Download size={15} />{t.download}
                </button>
                <button onClick={handleCopyHTML} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <RefreshCw size={14} />{copied ? t.copied : t.copyHTML}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-amber-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
