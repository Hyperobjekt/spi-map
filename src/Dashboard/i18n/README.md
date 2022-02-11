# Internationalization (i18n)

## Setting the Language

The `useSetLang` hook is used to set the language for the application. You can pass an optional language dictionary to set the language lookup for the provided language.

**Example 1:** set Spanish language lookup and set the active language to Spanish

```js
useSetLang("es", { TITLE: "Título", SUBTITLE: "Subtítulo" });
```

**Example 2:** switch language to English

```js
useSetLang("en");
```

> Note: this assumes that the `en` language file has been loaded or already added.

## Loading a language dictionary

Language dictionaries are key / value pairs that map an identifier to a string in a specific language. Keys remain consistent across languages, while the values are the translated strings.

**Example 1:** loading multiple language dictionaries

```js
// JSON file should contain an object with key / value pairs
useLoadLang("en", "https://example.com/en.json");
// CSV file should contain "key" and "value" columns
useLoadLang("en", "https://example.com/es.csv");
```

## Using language strings

The `useLang` hook can be used to retrieve a single string, or multiple strings from the language store. The returned strings will correspond to whatever language is currently set.

**Example 1:** retrieving a single string

```js
const title = useLang("TITLE");
```

**Example 2:** retrieving multiple strings

```js
const [title, subheading] = useLang(["TITLE", "SUBHEADING"]);
```

**Example 3:** retrieving a string with dynamic values

If an object is passed along as a second argument, the values will be interpolated into the string anywhere a corresponding key is found wrapped in double curly braces.

```js
useSetLang("en", { SUMMARY_LABEL: "The data below is for {{date}}." });
const summaryLabel = useLang("SUMMARY_LABEL", { date: "January 18, 2020" });
// resulting string: "The data below is for January 18, 2020."
```
