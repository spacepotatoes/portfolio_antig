# Projektregeln für Claude

## Kommunikation
- Beantworte immer zuerst die gestellte Frage, bevor du Code schreibst oder Änderungen vornimmst.
- Erkläre was du tust und warum, bevor du es tust.

## Secrets & Git-Sicherheit
- **Niemals Tokens, API-Keys, Passwörter oder andere Secrets in versionierte Dateien schreiben oder auf GitHub pushen.**
- Vor jedem Commit prüfen, ob sensible Daten in geänderten Dateien enthalten sind.
- Secrets gehören ausschließlich in `.env` (lokal) oder ins Vercel-Dashboard (Production).

## Dateien & Code
- Niemals Dateien, Ordner oder Code löschen, ohne vorher explizit zu fragen und eine Bestätigung zu erhalten.
- Niemals Funktionen, Komponenten oder Konfigurationen entfernen, ohne Rückfrage — auch wenn sie ungenutzt wirken.
- Änderungen immer minimal halten: nur das anfassen, was für die Aufgabe nötig ist.
- Bereits implementierte Logik niemals entfernen oder überschreiben, es sei denn es ist für die Aufgabe ausdrücklich erforderlich. Wenn eine Änderung bestehendes überschreiben würde, erst fragen.
