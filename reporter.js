const fs = require('fs')
const glob = require('@actions/glob');
const core = require('@actions/core');
const path = require('path');

var reporter = {};

reporter.loadGradleFiles = async function() {
  const patterns = ['**/*.gradle', '**/*.kts', '!**/.gradle/']
  const globber = await glob.create(patterns.join('\n'))
  const files = await globber.glob()
  return files.map(function(filePath){
    const fileValue = fs.readFileSync(filePath, 'utf8')
    return {
      path: filePath,
      content: new Buffer(fileValue).toString('base64')
    }
  })
}

reporter.fetchRemoteFiles = async function(octokit, filePaths, ref, owner, repo) {
  const requests = filePaths.map(async function(path){
    const content = await octokit.repos.getContents({
      owner: owner,
      repo: repo,
      ref: ref,
      path: path,
    })
    return {
      path: path,
      content: content.data.content.replace(/\r?\n/g, ''),
      sha: content.data.sha
    }
  })
  var results = [];
  for await (const result of requests) {
    core.info(result)
    results.push(result);
  }

  return results
}

module.exports = reporter;
