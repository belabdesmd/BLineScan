export interface Summary {
  featureCount: number,
  baselineCoverage: number, // percentage of features with baseline `high`
  earliestFeatureAdoption: string, // earliest baseline_low_date
  latestFeatureAdoption: string, // latest baseline_low_date
  nonBaselineFeatureCount: number,
  baselineHealth: number
}

export interface Feature {
  name: string,
  description: string,
  status: {
    baseline: string,
    baseline_high_date: string,
    baseline_low_date: string
  }
}

export interface Report {
  metadata: {
    name: string,
    createdAt: string,
  },
  summary: Summary,
  charts: {
    baselineDistribution: {
      experimental: number,
      low: number,
      high: number
    },
    featureAdoptionTimeline: {
      year: number,
      number: number,
    }[],
    featureCategoryBreakdown: {
      html: number,
      css: number,
    }
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
