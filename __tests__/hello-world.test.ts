/**
 * hello-worldワークフローのテスト
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// coreモジュールをモック化
jest.unstable_mockModule('@actions/core', () => core)

// テスト対象のモジュールをインポート
const { run } = await import('../src/workflows/hello-world.js')

describe('hello-world.ts', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.resetAllMocks()
    delete process.env.INPUT_NAME
  })

  it('デフォルトで"Hello World!"を出力する', async () => {
    core.getInput.mockReturnValue('')

    await run()

    expect(core.info).toHaveBeenCalledWith('Hello World!')
    expect(core.setOutput).toHaveBeenCalledWith('message', 'Hello World!')
  })

  it('カスタム名で挨拶を出力する', async () => {
    core.getInput.mockReturnValue('太郎')

    await run()

    expect(core.info).toHaveBeenCalledWith('Hello 太郎!')
    expect(core.setOutput).toHaveBeenCalledWith('message', 'Hello 太郎!')
  })

  it('エラーが発生した場合に適切に処理する', async () => {
    core.getInput.mockImplementation(() => {
      throw new Error('テストエラー')
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Hello World workflow failed: テストエラー'
    )
  })
})
