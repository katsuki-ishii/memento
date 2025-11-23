name: Feature request
about: Suggest an idea for this project
labels: enhancement

body:
  - type: textarea
    id: problem
    attributes:
      label: Problem / motivation
      description: What is the user problem?
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: Proposal
      description: What should be built? Keep it small and testable.
    validations:
      required: true
  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance criteria
      description: Bullet list of done conditions.
  - type: textarea
    id: notes
    attributes:
      label: Notes / links
