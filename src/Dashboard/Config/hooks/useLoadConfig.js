import { useEffect } from "react";
import { useConfigStore } from "..";
import { useLangStore } from "../../i18n";
import useDashboardStore from "../../store";

/**
 * Loads a config object
 */
export default async function useLoadConfig(config) {
  const loadConfig = useConfigStore((state) => state.loadConfig);
  const loadLanguageDict = useLangStore((state) => state.loadLanguageDict);
  const setReady = useConfigStore((state) => state.setReady);
  const setDefaults = useDashboardStore((state) => state.setDefaultsFromConfig);

  /**
   * Load all configs in the config object
   */
  useEffect(() => {
    // separate lang from other configs (they go in a separate store)
    const { lang = {}, ...configEntries } = config;
    // load configs
    const configPromises = Object.keys(configEntries).map((key) => {
      const entry = config[key];
      const url = typeof entry === "string" ? entry : entry.url;
      const options = (typeof entry === "object" && entry.options) || {};
      return loadConfig(key, url, options);
    });
    // load languages
    const langPromises = Object.keys(lang).map((key) => {
      const url = lang[key];
      return loadLanguageDict(key, url);
    });
    // combine promises and set ready once all have resolved.
    Promise.all([configPromises, langPromises].flat()).then((configs) => {
      const configObj = configs.reduce((acc, config) => {
        if (!config || !config.type) return acc;
        acc[config.type] = config.config;
        return acc;
      }, {});
      setDefaults(configObj);
      setReady(true);
    });
  }, [setDefaults, loadConfig, loadLanguageDict, config]);
}
