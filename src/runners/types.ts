import type { Language, RunnerResult } from '../types'

export interface Runner {
  language: Language
  run: (code: string) => Promise<RunnerResult>
  cleanup?: () => void
}
