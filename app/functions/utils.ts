import {useMatches, useFetchers} from '@remix-run/react';

export function useAnalyticsFromLoaders(dataKey = 'analytics') {
  const matches = useMatches();
  const data = {};

  matches.forEach((event) => {
    const eventData = event?.data;
    if (eventData && eventData[dataKey]) {
      Object.assign(data, eventData[dataKey]);
    }
  });

  return data;
}

export function useAnalyticsFromActions(dataKey = 'analytics') {
  const fetchers = useFetchers();
  const data = {};

  for (const fetcher of fetchers) {
    const formData = fetcher.submission?.formData;
    const fetcherData = fetcher.data;

    // Make sure that you have a successful action and an analytics payload
    if (formData && fetcherData && fetcherData[dataKey]) {
      Object.assign(data, fetcherData[dataKey]);

      try {
        if (formData.get(dataKey)) {
          // If the form submission contains data for the same dataKey
          // and is JSON parseable, then combine it with the resulting object
          const dataInForm = JSON.parse(String(formData.get(dataKey)));
          Object.assign(data, dataInForm);
        }
      } catch {
        // do nothing
      }
    }
  }
  return Object.keys(data).length ? data : undefined;
}
// filename: app/utils.tsx (or preffered destination)

// Filters out public environment variables to prevent private ones from being sent
// to the browser
export function getPublicEnv(env: Env) {
  if (typeof env !== 'object') {
    return null;
  }

  const defaultPublicEnv = {};

  const publicEnv = Object.keys(env).reduce((acc, key) => {
    if (acc && key.startsWith('PUBLIC_')) {
      const envKey = key;
      const envValue = env[envKey];
      acc[envKey] = envValue;
    }
    return acc;
  }, defaultPublicEnv);

  if (publicEnv && Object.keys(publicEnv).length === 0) {
    return null;
  }

  return publicEnv;
}

// Returns the public environment variables anywhere in your app
export function useEnv(key: string = 'publicEnv') {
  const [root] = useMatches();
  return root?.data?.[key] ?? {};
}
