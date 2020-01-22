const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const reporter = require('./reporter');

async function run() {
  try {
    const fileValue = fs.readFileSync(`${process.env.GITHUB_WORKSPACE}/app/build/dependencyUpdates/report.json`, 'utf8');
    const replaced = reporter.generateReplace(`${process.env.GITHUB_WORKSPACE}/app/build.gradle`, reporter.parse(JSON.parse(fileValue)))
    const fullRepository = process.env.GITHUB_REPOSITORY.split('/');
    const owner = fullRepository[0];
    const repo = fullRepository[1];

    const octokit = new github.GitHub(process.env.GITHUB_TOKEN);
    await octokit.git.createRef({
      owner: owner,
      repo: repo,
      ref: 'refs/heads/dependencies-update',
      sha: process.env.GITHUB_SHA,
    })
    const content = await octokit.repos.getContents({
      owner: owner,
      repo: repo,
      ref: 'refs/heads/dependencies-update',
      path: 'app/build.gradle', // ファイルパス
    })
    await octokit.repos.createOrUpdateFile({
      owner: owner,
      repo: repo,
      branch: 'dependencies-update',
      message: 'update dependencies',
      path: 'app/build.gradle',
      content: new Buffer(`${ replaced }`).toString('base64'), // base64にエンコードする
      sha: content.data.sha,
    })
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
