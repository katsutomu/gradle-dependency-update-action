
<p align="center">
  <a href="https://github.com/katsutomu/gradle-dependency-update-action/actions"><img alt="javscript-action status" src="https://github.com/actions/javascript-action/workflows/units-test/badge.svg"></a>
</p>

# Create dependency update pull request

Support updating dependent libraries in Gradle. Make a pull request for Gradle file updated by Gradle Use Latest Versions Plugin.

This plugin depends on the [Gradle Use Latest Versions Plugin](https://github.com/patrikerdes/gradle-use-latest-versions-plugin)

## Usage

You can now consume the action by referencing the master branch
Execute useLatestVersions in advance

```yaml
run: gradle useLatestVersions
uses: katsutomu/gradle-dependency-update-action@master
```
