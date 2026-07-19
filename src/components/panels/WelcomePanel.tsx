import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { Code, Sun, Moon } from '../icons'
import WelcomeHome from '../welcome/WelcomeHome'
import WelcomeFeatures from '../welcome/WelcomeFeatures'
import WelcomeLessons from '../welcome/WelcomeLessons'
import WelcomeAbout from '../welcome/WelcomeAbout'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'languages', label: 'Features' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'about', label: 'About' },
]

export default function WelcomePanel() {
  const { state, setTheme, setShowWelcome } = useAppContext()
  const [tab, setTab] = useState('home')
  const isDark = state.theme === 'dark'

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
      {/* Navbar */}
      <div className={`border-b ${isDark ? 'border-white/5 bg-[#0f1012]' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <button onClick={() => setTab('home')} className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Code className="h-4 w-4" />
            </div>
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>CodeStudio</span>
          </button>

          {/* Desktop tabs */}
          <div className="hidden sm:flex items-center gap-6">
            {TABS.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`relative text-sm font-medium transition-colors py-1 ${
                  tab === item.id
                    ? 'text-brand-500'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
                {tab === item.id && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-brand-500" />
                )}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-90 ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowWelcome(false)}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-brand-600/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-brand-500/25 active:scale-[0.97]"
            >
              <span className="relative z-10">Open IDE</span>
              <span className="absolute inset-0 -translate-x-full rounded-lg bg-gradient-to-r from-brand-500 to-brand-400 transition-transform duration-300 group-hover:translate-x-0" />
            </button>
          </div>
        </div>
      </div>

      <div className={`px-4 ${tab === 'home' || tab === 'about' ? 'pb-0 pt-0' : 'pb-16 pt-8 sm:pt-10'}`}>
        {/* Mobile tabs */}
        <div className={`sm:hidden flex gap-1 mb-8 p-1 rounded-lg border ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/50'}`}>
          {TABS.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === item.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'home' && <WelcomeHome onNavigate={(p) => setTab(p)} />}
        {tab === 'languages' && <WelcomeFeatures />}
        {tab === 'lessons' && <WelcomeLessons />}
        {tab === 'about' && <WelcomeAbout />}
      </div>
    </div>
  )
}
