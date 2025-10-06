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
  summary: Summary,
  charts: {
    baselineDistribution: {
      experimental: number,
      low: number,
      medium: number,
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

export const example: Report = {
  summary: {
    featureCount: 42,
    baselineCoverage: 76,
    earliestFeatureAdoption: "2016-03-15",
    latestFeatureAdoption: "2024-08-22",
    nonBaselineFeatureCount: 10,
    baselineHealth: 34
  },
  charts: {
    baselineDistribution: {
      experimental: 1,
      low: 8,
      medium: 12,
      high: 22
    },
    featureAdoptionTimeline: [
      {year: 2016, number: 2},
      {year: 2018, number: 4},
      {year: 2020, number: 9},
      {year: 2022, number: 15},
      {year: 2024, number: 12}
    ],
    featureCategoryBreakdown: {
      html: 25,
      css: 17
    }
  },
  html: {
    summary: {
      featureCount: 25,
      baselineCoverage: 80,
      earliestFeatureAdoption: "2016-03-15",
      latestFeatureAdoption: "2024-04-20",
      nonBaselineFeatureCount: 5,
      baselineHealth: 34
    },
    features: [
      {
        name: "flexbox",
        description: "CSS Flexible Box Layout Module allows responsive alignment of elements within a container.",
        status: {
          baseline: "high",
          baseline_high_date: "2017-03-01",
          baseline_low_date: "2012-07-01"
        }
      },
      {
        name: "grid",
        description: "CSS Grid Layout provides a two-dimensional grid-based layout system, enabling precise control over rows and columns.",
        status: {
          baseline: "medium",
          baseline_high_date: "2019-03-15",
          baseline_low_date: "2017-10-01"
        }
      },
      {
        name: "dialog",
        description: "The HTML <dialog> element represents a modal or non-modal dialog box in a document.",
        status: {
          baseline: "low",
          baseline_high_date: "2023-05-01",
          baseline_low_date: "2020-01-10"
        }
      },
      {
        name: "subgrid",
        description: "CSS Subgrid allows grid items to inherit and align with the parent grid’s column and row tracks.",
        status: {
          baseline: "low",
          baseline_high_date: "2024-06-01",
          baseline_low_date: "2022-08-20"
        }
      }
    ]
  },
  css: {
    summary: {
      featureCount: 17,
      baselineCoverage: 70,
      earliestFeatureAdoption: "2017-01-10",
      latestFeatureAdoption: "2023-11-08",
      nonBaselineFeatureCount: 5,
      baselineHealth: 34
    },
    features: [
      {
        name: "flexbox",
        description: "CSS Flexible Box Layout Module allows responsive alignment of elements within a container.",
        status: {
          baseline: "high",
          baseline_high_date: "2017-03-01",
          baseline_low_date: "2012-07-01"
        }
      },
      {
        name: "grid",
        description: "CSS Grid Layout provides a two-dimensional grid-based layout system, enabling precise control over rows and columns.",
        status: {
          baseline: "medium",
          baseline_high_date: "2019-03-15",
          baseline_low_date: "2017-10-01"
        }
      },
      {
        name: "dialog",
        description: "The HTML <dialog> element represents a modal or non-modal dialog box in a document.",
        status: {
          baseline: "low",
          baseline_high_date: "2023-05-01",
          baseline_low_date: "2020-01-10"
        }
      },
      {
        name: "subgrid",
        description: "CSS Subgrid allows grid items to inherit and align with the parent grid’s column and row tracks.",
        status: {
          baseline: "low",
          baseline_high_date: "2024-06-01",
          baseline_low_date: "2022-08-20"
        }
      }
    ]
  }
}
