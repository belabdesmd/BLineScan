interface BrowsersSupport {
  chrome: string,
  chrome_android: string,
  edge: string,
  firefox: string,
  firefox_android: string,
  safari: string,
  safari_ios: string,
}

interface Summary {
  detected_features: number,
  baseline_level: "low" | "medium" | "high",
  support_summary: BrowsersSupport,
  baseline_lowest_date: string,
}

interface Feature {
  name: string,
  description: string,
  status: {
    baseline: string,
    baseline_high_date: string,
    baseline_low_date: string,
    support: BrowsersSupport
  }
}

export interface Report {
  overall: {
    featureCount: number,
    baselineLevel: "low" | "medium" | "high",
    supportSummary: string,
    earliestDate: string
  },
  html: {
    summary: Summary,
    features: Feature[]
  },
  css: {
    summary: Summary,
    features: Feature[]
  }
}
