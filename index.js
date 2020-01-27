const core = require('@actions/core');
const github = require('@actions/github');
// const fs = require('fs');
const reporter = require('./reporter');

async function run() {
  try {
    const fullRepository = process.env.GITHUB_REPOSITORY.split('/');
    const owner = fullRepository[0];
    const repo = fullRepository[1];

    console.log("start update");
    let files = await reporter.loadGradleFiles()
    files = files.map(function(file){
        file.path = file.path.replace(`${process.env.GITHUB_WORKSPACE}/`, '')
        return file
      }
    )
    console.log(files);
    const paths = files.map(file => file.path)
    const octokit = new github.GitHub(process.env.GITHUB_TOKEN);
    const preFiles = await reporter.fetchRemoteFiles(octokit, paths, process.env.GITHUB_REF, owner, repo)
    console.log(preFiles);
    const diffFiles = []
    files.forEach(file => {
      let matchedFile = preFiles.find(preFile => preFile.path == file.path)
      if (
        matchedFile != undefined &&
        matchedFile.content != file.content
      ) {
        file.presha = matchedFile.sha
        diffFiles.push(file)
      }
    });
    console.log(diffFiles);
    if (diffFiles.length) {
      await octokit.git.createRef({
        owner: owner,
        repo: repo,
        ref: 'refs/heads/dependencies-update',
        sha: process.env.GITHUB_SHA,
      })
      const requests = diffFiles.map(async function(item){
        await octokit.repos.createOrUpdateFile({
          owner: owner,
          repo: repo,
          branch: 'dependencies-update',
          message: `update dependencies ${item.path}`,
          path: item.path,
          content: item.content,
          sha: item.presha,
        })
      });
      for await (const result of requests) {
        console.log(result);
      }
      await octokit.pulls.create({
        owner: owner,
        repo: repo,
        title: 'Dependencies Update',
        head: 'dependencies-update',
        base: 'develop'
      })
    }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
