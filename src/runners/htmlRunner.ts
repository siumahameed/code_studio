import type { RunnerResult } from '../types'

export function runHTML(_code: string): RunnerResult {
  return {
    stdout: 'HTML page rendered in preview.',
    stderr: '',
    error: null,
  }
}
