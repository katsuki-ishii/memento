name: Bug report
about: Create a report to help us improve
labels: bug

body:

- type: textarea
  id: summary
  attributes:
  label: Summary
  description: What happened?
  placeholder: Clear and concise description of the bug.
  validations:
  required: true
- type: textarea
  id: steps
  attributes:
  label: Steps to reproduce
  description: Provide minimal steps.
  validations:
  required: true
- type: textarea
  id: expected
  attributes:
  label: Expected behavior
  validations:
  required: true
- type: textarea
  id: screenshots
  attributes:
  label: Screenshots / recordings (if applicable)
- type: textarea
  id: env
  attributes:
  label: Environment
  description: OS, browser, app version/commit.
