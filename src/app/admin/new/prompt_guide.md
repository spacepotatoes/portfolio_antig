# Prompt Guide: UX Case Study JSON Generator

Kopiere diesen Prompt und füge ihn in ChatGPT, Claude oder eine andere KI ein, um ein perfekt formatiertes JSON für dein Portfolio zu erhalten.

---

## Der Prompt

> Erstelle eine detaillierte UX Case Study für ein Projekt mit dem Titel "[TITEL DEINES PROJEKTS]" und der Beschreibung "[BESCHREIBUNG DEINES PROJEKTS]".
> 
> Gib das Ergebnis **ausschließlich** im folgenden JSON-Format aus:
> 
> ```json
> {
>   "title": "Titel des Projekts",
>   "description": "Ausführliche Projektbeschreibung",
>   "category": "Webdesign | Webentwickler | Fotograf",
>   "techStack": "React, Next.js, etc.",
>   "persona": {
>     "name": "Name der Persona",
>     "bio": "Ein prägnanter Lebenslauf der Zielperson",
>     "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"
>   },
>   "painPoints": ["Punkt 1", "Punkt 2", "Punkt 3"],
>   "empathyMap": {
>     "says": "Was der Nutzer sagt...",
>     "thinks": "Was der Nutzer denkt...",
>     "feels": "Was der Nutzer fühlt...",
>     "does": "Was der Nutzer tut..."
>   },
>   "userJourney": [
>     { "label": "Phase 1", "value": 30 },
>     { "label": "Phase 2", "value": 60 },
>     { "label": "Phase 3", "value": 45 },
>     { "label": "Phase 4", "value": 90 }
>   ]
> }
> ```
> 
> Wichtig: 
> - Die `userJourney` Werte sollten zwischen 0 und 100 liegen.
> - Nutze für das Persona-Bild einen passenden Link von Unsplash.
> - Gib keine weiteren Erklärungen ab, nur das JSON.

---

## Beispiel JSON format
```json
{
  "title": "EcoTrack App",
  "description": "Eine App zur Verfolgung des persönlichen CO2-Fußabdrucks.",
  "category": "Webdesign",
  "techStack": "React Native, Node.js, MongoDB",
  "persona": {
    "name": "Greta Eco",
    "bio": "Umweltbewusste Studentin, die ihren Alltag nachhaltiger gestalten möchte.",
    "imageUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"
  },
  "painPoints": [
    "Unübersichtliche Datenquellen",
    "Mangel an motivierendem Feedback",
    "Schwierigkeit, Erfolge zu teilen"
  ],
  "empathyMap": {
    "says": "Ich möchte genau sehen, wo ich sparen kann.",
    "thinks": "Ist mein Impact wirklich groß genug?",
    "feels": "Überwältigt von der Klimakrise.",
    "does": "Sucht nach einfachen Tipps im Internet."
  },
  "userJourney": [
    { "label": "Onboarding", "value": 80 },
    { "label": "Erste Eingabe", "value": 40 },
    { "label": "Analyse", "value": 60 },
    { "label": "Ziel erreicht", "value": 95 }
  ]
}
```
