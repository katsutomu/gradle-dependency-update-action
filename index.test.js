jest.mock('fs', () => ({
        readFileSync: jest.fn(filePath => `hoge.huga.piyo:lib:1.0.1`)
}));

const reporter = require('./reporter');
const fs = require('fs');

// shows how the runner will run a javascript action with env / stdout protocol
test('test parse', () => {
  const report = {
    outdated: {
      dependencies:[{
        group: "hoge.huga.piyo",
        name: "lib",
        version: "1.0.1",
        available: {
          milestone: "1.0.2"
        }
      }]
    }
  }
  var parsed = reporter.parse(report)
  expect(parsed[0].current).toMatch("1.0.1")
  expect(parsed[0].available).toMatch("1.0.2")
  expect(parsed[0].library).toMatch("hoge.huga.piyo:lib")
})

test('test generateReplace', () => {
  const replaced = reporter.generateReplace('hoge', [{
    library: "hoge.huga.piyo:lib",
    current: "1.0.1",
    available: "1.0.2"
  }])
  expect(fs.readFileSync.mock.calls.length).toBe(1);
  expect(fs.readFileSync.mock.calls[0][0]).toBe('hoge');
  expect(replaced).toBe('hoge.huga.piyo:lib:1.0.2');
})
