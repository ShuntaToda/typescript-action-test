/**
 * daily-activityワークフローのテスト
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// coreモジュールをモック化
jest.unstable_mockModule('@actions/core', () => core)

// githubモジュールをモック化
const mockGithubContext = {
  repo: {
    owner: 'テストオーナー',
    repo: 'テストリポジトリ'
  },
  runId: 12345,
  actor: 'テストユーザー'
}

jest.unstable_mockModule('@actions/github', () => ({
  context: mockGithubContext
}))

// テスト対象のモジュールをインポート
const { run } = await import('../src/workflows/daily-activity.js')

describe('daily-activity.ts', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.resetAllMocks()

    // GitHubコンテキストをデフォルト値にリセット
    mockGithubContext.repo.owner = 'テストオーナー'
    mockGithubContext.repo.repo = 'テストリポジトリ'
    mockGithubContext.runId = 12345
    mockGithubContext.actor = 'テストユーザー'
  })

  it('日次アクティビティレポートを生成する', async () => {
    await run()

    expect(core.info).toHaveBeenCalledWith('=== Daily Activity Report ===')
    expect(core.info).toHaveBeenCalledWith(
      expect.stringMatching(/^Date: \d{4}-\d{2}-\d{2}$/)
    )
    expect(core.info).toHaveBeenCalledWith(
      'Repository: テストオーナー/テストリポジトリ'
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'activity-summary',
      expect.stringContaining('"repository":"テストオーナー/テストリポジトリ"')
    )
  })

  it('有効なJSON出力を生成する', async () => {
    await run()

    const setOutputCalls = core.setOutput.mock.calls
    const activitySummaryCall = setOutputCalls.find(
      (call) => call[0] === 'activity-summary'
    )

    expect(activitySummaryCall).toBeDefined()

    // 有効なJSONかどうかを確認
    const jsonOutput = activitySummaryCall![1]
    expect(() => JSON.parse(jsonOutput as string)).not.toThrow()

    // JSON構造を確認
    const parsed = JSON.parse(jsonOutput as string)
    expect(parsed).toHaveProperty('date')
    expect(parsed).toHaveProperty('repository')
    expect(parsed).toHaveProperty('owner')
    expect(parsed).toHaveProperty('triggeredBy')
  })

  it('エラーが発生した場合に適切に処理する', async () => {
    core.info.mockImplementation(() => {
      throw new Error('テストエラー')
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Daily activity workflow failed: テストエラー'
    )
  })
})
