import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * Daily Activity ワークフローのメイン関数
 * リポジトリ作成者のアクティビティを表示します
 */
export async function run(): Promise<void> {
  try {
    const context = github.context
    const repoOwner = context.repo.owner
    const repoName = context.repo.repo
    const runId = context.runId.toString()
    const actor = context.actor

    const currentDate = new Date().toISOString().split('T')[0]

    core.info('=== Daily Activity Report ===')
    core.info(`Date: ${currentDate}`)
    core.info(`Repository: ${repoOwner}/${repoName}`)
    core.info(`Repository Owner: ${repoOwner}`)
    core.info(`Triggered by: ${actor}`)
    core.info(`Run ID: ${runId}`)

    // GitHub APIを使わずに基本的な情報のみ表示
    const activitySummary = {
      date: currentDate,
      repository: `${repoOwner}/${repoName}`,
      owner: repoOwner,
      triggeredBy: actor,
      runId: runId,
      message: `Daily activity check completed for ${repoOwner}'s repository`
    }

    core.info(`Activity Summary: ${activitySummary.message}`)
    core.setOutput('activity-summary', JSON.stringify(activitySummary))

    core.debug('Daily activity workflow executed successfully')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Daily activity workflow failed: ${error.message}`)
    }
  }
}
