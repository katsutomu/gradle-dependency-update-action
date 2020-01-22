
<p align="center">
  <a href="https://github.com/katsutomu/gradle-dependency-update-action/actions"><img alt="javscript-action status" src="https://github.com/actions/javascript-action/workflows/units-test/badge.svg"></a>
</p>

# Create dependency update pull request

Support updating dependent libraries in Gradle. Update dependencies from Gradle Versions Plugin's dependencyUpdates report and generate pull requests. 

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: katsutomu/gradle-dependency-update-action@v1
with:
  milliseconds: 1000
```
