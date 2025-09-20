import * as core from '@actions/core'
import { run as mainFunc } from './main.js'
import { run as helloWorld } from './workflows/hello-world.js'
import { run as dailyActivity } from './workflows/daily-activity.js'

const getWorkflowType = (): string => {
  // GitHub Actionの入力パラメータから取得、環境変数もフォールバックとして使用
  return (
    core.getInput('workflow-type') || process.env.WORKFLOW_TYPE || 'default'
  )
}

const main = async (): Promise<void> => {
  const workflowType = getWorkflowType()

  switch (workflowType) {
    case 'hello-world':
      await helloWorld()
      break
    case 'daily-activity':
      await dailyActivity()
      break
    case 'default':
    default:
      await mainFunc()
      break
  }
}

main().catch((error) => {
  console.error('Workflow execution failed:', error)
  process.exit(1)
})
