import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { includes } from 'lodash';
import * as moment from 'moment';

import enUS from '../../translations/en-US.json';
import ruRU from '../../translations/ru-RU.json';

const languageKey = 'language';

/**
 * Pass-through function to mark a string for translation extraction.
 * Running `npm translations:extract` will include the given string by using this.
 * @param {string} s The string to extract for translation.
 * @return {string} The same string.
 */
export function extract(s: string) {
  return s;
}

@Injectable()
export class I18nService {

  defaultLanguage: string;
  supportedLanguages: string[];

  constructor(private translateService: TranslateService) {
    // Embed languages to avoid extra HTTP requests
    translateService.setTranslation('EN', enUS );
    translateService.setTranslation('RU', ruRU );
  }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param {!string} defaultLanguage The default language to use.
   * @param {Array.<String>} supportedLanguages The list of supported languages.
   */
  init(defaultLanguage: string, supportedLanguages: string[])
  {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;

    let detectedLanguage:any = null;
    try
    {
      detectedLanguage = (window.navigator['userLanguage'] || window.navigator.language || 'EN').toUpperCase();
    }catch (e)
    {
    }

    this.language = localStorage.getItem(languageKey) || detectedLanguage;

    this.translateService.onLangChange
      .subscribe((event: LangChangeEvent) => { localStorage.setItem(languageKey, event.lang); });
  }

  instant(key : string) : string | any
  {
    return this.translateService.instant(key);
  }
  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param {string} language The IETF language code to set.
   */
  set language(language: string) {
    language = language || localStorage.getItem(languageKey);
    const isSupportedLanguage = includes(this.supportedLanguages, language);
    if (language != 'EN')
    {
      moment.locale('ru');
    }
    else
    {
      moment.locale('en');
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    this.translateService.use(language);
  }

  /**
   * Gets the current language.
   * @return {string} The current language code.
   */
  get language(): string {
    return this.translateService.currentLang;
  }

}
