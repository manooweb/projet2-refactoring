export const ERROR_MESSAGES = {
  technical: {
    title: 'A technical error occurred',
    action: 'Please try again later or contact support if the problem persists.',
  },
  pageNotFound: 'No corresponding page found',
  countryNotFound: (countryName: string): string => `Country "${countryName}" not found`,
} as const;
