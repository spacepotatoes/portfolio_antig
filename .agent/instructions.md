# Portfolio Project Instructions & Rules

Diese Datei enthält Anweisungen und Regeln für Antigravity, um sicherzustellen, dass Änderungen am Projekt den Vorstellungen des Users entsprechen.

## Allgemeine Regeln
- **Keine ungefragten Layout-Änderungen**: Strukturelle Änderungen an der Navigation oder dem Seitenaufbau in `layout.tsx` oder `page.tsx` sollten immer erst abgestimmt werden.
- **Erst einmal Fragen beantworten**: Falls Fragen gestellt werden, diese erst mal klären und abwägen. 
- **Navigation bewahren**: Die Kategorie-Links in der Navigation (`Alle`, `Webdesign`, `Entwicklung`, `Fotografie`) sind wichtig für die Filter-Funktion und sollten nicht ohne Rücksprache durch Anker-Links ersetzt werden.
- **Design-Konsistenz**: Neue Elemente müssen dem minimalen, Schwarz-Weiß-Stil (High-Contrast) entsprechen.

## Technische Vorgaben
- **Tailwind v4**: Da Tailwind CSS v4 verwendet wird, achte bei `@apply` besonders auf die Syntax (keine Leerzeichen in komplexen Arbitrary Values wie `clamp`).
- **Standard-CSS als Fallback**: Falls Tailwind-Parser bei komplexen CSS-Funktionen Fehler werfen, nutze Standard-CSS in `globals.css`.
