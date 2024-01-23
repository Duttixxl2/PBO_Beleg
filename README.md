# Projektarbeit: Entwicklung einer Stundenplan-App für die HTW

## Get started

### Project Setup

 ```sh
 npm install
 ```
 #### Create .env File
 ```sh
 VITE_API_USER=api_user
 VITE_API_PASSWORD=Musst du selbst wissen :)
 ```
 #### Compile and Hot-Reload for Development

 ```sh
 npm run dev
 ```

## Überblick über "relevante" Files

- assets: nichts relevantes
- components:
  - minimal_comonents:
    - Input_Studygroup: Komplette Eingabe/Funkionalität der Suche in **FirstView**(@/)
  - Calendar: **Wochenansicht**
  - TimetableLayout: Aufruf von Calendar (wochenansicht)
  - **Menu**: linke Menu-Leiste
  - **Settings**: rechtse Menu-Leiste
  - TTModule: **Tagesansicht**
- **router**: Routen der App
- stores:
  - studgruppen: Speicherung aller Studiengruppen
  - **timetable**: Speicherung aller Stundenpläne, außer Gruppe (wird per Api geladen)
  - **module**: Für Create und Edit von Stundenplänen
- views:
  - **Create_Timetable**: Create/Edit des Stundenplans
  - FirstView: Startseite, Aufruf von Input_Studygroup
  - Stundenplan_Stundenplane: Übersicht aller Stundenpläne
  - Stundenplan_Tagesansicht: Aufruf TTModule
  - Stundenplan_Wochenansicht: Aufruf TimetableLayout
- App: Einbindung von Menu, Settings und Router
- ../**vite.config.js**: Api-Urls, Init von @

## Zielsetzung

Das übergeordnete Ziel unserer Anwendung ist die Entwicklung einer benutzerfreundlichen App bzw. eines Webprojekts, das den Stundenplan der Hochschule für Technik und Wirtschaft Dresden anzeigt, detailliert bearbeitet werden kann, die Erstellung individueller Stundenpläne ermöglicht und die Suche nach allen Terminen eines bestimmten Moduls, einschließlich Praktika-Terminen anderer Seminargruppen, ermöglicht.

## Umsetzung

Die zentrale Komponente unserer Anwendung befindet sich im Ordner `src`. Die `App.vue` fungiert als globale Gestaltungsseite der Anwendung. Innerhalb des Ordners `views` sind die verschiedenen Seiten der Anwendung organisiert, während der Ordner `components` die unterschiedlichen, wiederkehrenden Komponenten beherbergt. Eine zusätzliche Unterteilung in `minimal_components` erfolgt, um kleinere Elemente wie Buttons zu gruppieren.

## Aktueller Fortschritt

Trotz einiger krankheitsbedingter Ausfälle konnten bereits bedeutende Fortschritte in Bezug auf die grundlegende Struktur und Navigation erzielt werden. Insbesondere die API-Anbindung mithilfe von Pinia funktioniert bereits reibungslos. Der aktuelle Fokus liegt darauf, die finalen Elemente der Stundenpläne zu implementieren. Die Befüllung dieser Elemente mit Inhalten sollte dabei reibungslos vonstattengehen, da die Anbindung an die API bereits erfolgreich umgesetzt wurde.

Die geplante Anwendung verspricht nicht nur eine effiziente Darstellung des HTW-Stundenplans, sondern auch eine intuitive Bearbeitung und Personalisierung. Die Funktionalität zur Suche nach Modulterminen über verschiedene Seminargruppen hinweg wird einen zusätzlichen Mehrwert bieten.

Trotz der bisherigen Herausforderungen sind wir zuversichtlich, dass die Anwendung in naher Zukunft fertiggestellt und einsatzbereit sein wird. Der Fokus liegt auf einer nutzerfreundlichen Oberfläche und einer zuverlässigen Integration aller Funktionen, um den Studierenden einen echten Mehrwert zu bieten.

Das grundsätzliche Design der App wurde noch nicht angefasst. Farbe und Form sind also noch offen.

# PBO-Beleg

 This template should help get you started developing with Vue 3 in Vite.

 ## Recommended IDE Setup

 [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

 ## Customize configuration

 See [Vite Configuration Reference](https://vitejs.dev/config/).

 ## Project Setup

 ```sh
 npm install
 ```

 ### Compile and Hot-Reload for Development

 ```sh
 npm run dev
 ```

 ### Compile and Minify for Production

 ```sh
 npm run build
 ```

 ### Lint with [ESLint](https://eslint.org/)

 ```sh
 npm run lint
 ```
