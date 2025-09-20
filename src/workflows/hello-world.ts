import * as core from '@actions/core'

/**
 * Hello World ワークフローのメイン関数
 * 手動実行でHello Worldを出力します
 */
export async function run(): Promise<void> {
  try {
    const name = core.getInput('name') || process.env.INPUT_NAME || 'World'
    const message = `Hello ${name}!`

    core.info(message)
    core.setOutput('message', message)

    // デバッグ情報も出力
    core.debug('Hello World workflow executed successfully')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Hello World workflow failed: ${error.message}`)
    }
  }
}
