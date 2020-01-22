const fs = require('fs')

var reporter = {};

reporter.parse = function(dependencies) {
  if (typeof(dependencies) !== 'object') {
    return;
  }
  return dependencies.outdated.dependencies.map(function(dependency){
      return {
        current: dependency.version,
        available: dependency.available.milestone,
        library: `${dependency.group}:${dependency.name}`
      }
    }
  )
}

reporter.generateReplace = function(filePath, reports) {
  var fileValue = fs.readFileSync(filePath, 'utf8');
  reports.forEach(dependency => {
    fileValue = fileValue.replace(
      `${dependency.library}:${dependency.current}`,
      `${dependency.library}:${dependency.available}`
    )
  })
  return fileValue
}

module.exports = reporter;
