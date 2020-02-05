const reporter = require('./reporter');

jest.mock('@actions/glob', () => ({
  create: jest.fn(_ => {
    return {
      glob: jest.fn(() => {
        return ["hoge.gradle", "huga.gradle"]
      })
    }
  })
}));

jest.mock('fs', () => ({
  readFileSync: jest.fn(filePath => {
    return {
      "hoge.gradle": "fileValueHoge",
      "huga.gradle": "fileValueHuga"
    }[filePath]
  })
}));

test('test loadGradleFiles', async () => {
  var fileList = await reporter.loadGradleFiles()
  const expected = [
    {"content": "ZmlsZVZhbHVlSG9nZQ==", "path": "hoge.gradle"},
    {"content": "ZmlsZVZhbHVlSHVnYQ==", "path": "huga.gradle"}
  ]
  expect(fileList).toEqual(
    expect.arrayContaining(expected)
  );
})

test('test fetchRemoteFiles', async () => {
  const dummyContent = {
    "hoge.gradle": {
      content: "hoge.gradle content value",
      sha: "hoge.gradle DUMMYSHA"
    },
    "huga.gradle":  {
      content: "huga.gradle content value",
      sha: "huga.gradle DUMMYSHA"
    }
  }
  const octokit = {
    repos: {
      getContents: jest.fn(async (request) => {
        return {
          data: {
            content: dummyContent[request.path].content,
            sha: dummyContent[request.path].sha
          }
        }
      })
    }
  }
  const filePaths = ["hoge.gradle", "huga.gradle"]
  var fileList = await reporter.fetchRemoteFiles(octokit, filePaths, "ref", "owner", "repo")

  const expected = [
    {"content": "hoge.gradle content value", "path": "hoge.gradle", "sha": "hoge.gradle DUMMYSHA"},
    {"content": "huga.gradle content value", "path": "huga.gradle", "sha": "huga.gradle DUMMYSHA"}
  ]
  expect(fileList).toEqual(
    expect.arrayContaining(expected)
  );
})
