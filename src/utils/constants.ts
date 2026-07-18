import type { LanguageConfig, Lesson } from '../types'

export const LANGUAGES: LanguageConfig[] = [
  { id: 'html', label: 'HTML', icon: '🌐', monacoLanguage: 'html', extension: '.html', outputMode: 'preview', accent: 'orange', tagline: 'Build web pages', bg: 'from-orange-400 to-rose-400', cardBg: 'bg-orange-50 border-orange-200', darkCardBg: 'bg-orange-500/10 border-orange-500/20' },
  { id: 'python', label: 'Python', icon: '🐍', monacoLanguage: 'python', extension: '.py', outputMode: 'console', accent: 'sky', tagline: 'Learn to code', bg: 'from-sky-400 to-blue-500', cardBg: 'bg-sky-50 border-sky-200', darkCardBg: 'bg-sky-500/10 border-sky-500/20' },
  { id: 'sql', label: 'SQL', icon: '🗄️', monacoLanguage: 'sql', extension: '.sql', outputMode: 'console', accent: 'amber', tagline: 'Talk to data', bg: 'from-amber-400 to-yellow-500', cardBg: 'bg-amber-50 border-amber-200', darkCardBg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'c', label: 'C', icon: '⚙️', monacoLanguage: 'c', extension: '.c', outputMode: 'console', accent: 'emerald', tagline: 'Code the machine', bg: 'from-emerald-400 to-teal-500', cardBg: 'bg-emerald-50 border-emerald-200', darkCardBg: 'bg-emerald-500/10 border-emerald-500/20' },
]

const HTML_CARD_CODE = '<!DOCTYPE html><html><head><style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0;background:linear-gradient(135deg,#fef3c7,#ecfdf5)}.card{background:white;padding:32px 40px;border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,.08);text-align:center;max-width:320px}.avatar{width:80px;height:80px;background:linear-gradient(135deg,#818cf8,#c084fc);border-radius:50%;margin:0 auto 16px;display:grid;place-items:center;font-size:36px}h1{color:#1e293b;font-size:1.5rem;margin:0}p{color:#64748b;margin-top:8px}.badge{display:inline-block;margin-top:16px;padding:6px 16px;background:#ecfdf5;color:#059669;border-radius:99px;font-weight:600;font-size:.85rem}</style></head><body><div class="card"><div class="avatar">\u{1F468}\u{200D}\u{1F4BB}</div><h1>Hi, I\'m Ada!</h1><p>I\'m learning to build websites</p><span class="badge">\u2728 Beginner Coder</span></div></body></html>'

const PYTHON_LOOP_CODE = 'total = 0\nfor number in range(1,6):\n    print("Counting:", number)\n    total = total + number\nprint("---")\nprint("Total:", total)'

const SQL_STUDENTS_CODE = 'SELECT name, grade\nFROM students\nWHERE grade > 85\nORDER BY grade DESC;'

const C_HELLO_CODE = '#include <stdio.h>\nint main() {\n    printf("Hello from C!\\n");\n    int score = 100;\n    printf("My score is %d\\n", score);\n    return 0;\n}'

export const LESSONS: Lesson[] = [
  { id: 'html-card', language: 'html', title: 'Build a Profile Card', description: 'Make a colorful card with your name', icon: '\u{1F0CF}', difficulty: 'beginner', code: HTML_CARD_CODE },
  { id: 'python-loop', language: 'python', title: 'Count with Loops', description: 'Print numbers 1-5 and add them up', icon: '\u{1F522}', difficulty: 'beginner', code: PYTHON_LOOP_CODE },
  { id: 'sql-students', language: 'sql', title: 'Find Top Students', description: 'Show students above 85, best first', icon: '\u{1F3C6}', difficulty: 'beginner', code: SQL_STUDENTS_CODE },
  { id: 'c-hello', language: 'c', title: 'Hello from C', description: 'Print a message with a number', icon: '\u{1F44B}', difficulty: 'beginner', code: C_HELLO_CODE },
]

export const STORAGE_KEY = 'codestudio-saved-code'
export const STORAGE_LANGUAGE_KEY = 'codestudio-language'
export const STORAGE_THEME_KEY = 'codestudio-theme'
export const STORAGE_FONT_KEY = 'codestudio-font-size'
export const DEFAULT_FONT_SIZE = 14
export const MIN_FONT_SIZE = 10
export const MAX_FONT_SIZE = 28
export const MONACO_THEMES = { dark: 'vs-dark', light: 'vs' }
export const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js'
export const SQL_WASM_URL = 'https://sql.js.org/dist/sql-wasm.wasm'
