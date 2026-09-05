# AI Workflow (INTERNAL DRAFT)

## Tooling
- **Google Antigravity**: Primary architectural agent used to refactor the React frontend and integrate Cloud Vision APIs. (VERIFIED)
- **Claude Code**: Initial code scaffolding agent. (PARTIAL - historical provenance inferred from earlier files).
- **Google Cloud Vision**: Target AI model for image recognition. (VERIFIED)

## Workflow Architecture
The application relies on an interchangeable AIProvider interface. When one provider hits operational limits, the interface permits switching to a fallback (e.g., Cloud Vision) while maintaining the structural integrity of the application's responses. (VERIFIED)
