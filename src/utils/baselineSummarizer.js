const BASELINE_ORDER = {low: 1, medium: 2, high: 3};

// ----------------------------------------------------- TOOLS
export function lowestBaseline(features) {
    return Object.keys(BASELINE_ORDER).find(level => features.some(f => f.status.baseline === level)) || "unknown";
}

export function aggregateSupport(features) {
    const summary = {};

    for (const feature of features) {
        const support = feature.status.support || {};
        for (const [browser, version] of Object.entries(support)) {
            // take the maximum (latest required) version
            if (!summary[browser] || version > summary[browser]) {
                summary[browser] = version;
            }
        }
    }

    return summary;
}

export function getEarliestDate(features) {
    const dates = features
        .map(f => f.status.baseline_low_date?.replace(/^[≤≥<>]\s*/, ""))
        .filter(d => d != null)
        .filter(Boolean)
        .map(d => new Date(d));

    return new Date(Math.min(...dates)).toISOString().split("T")[0];
}

export function getOverallSummary(htmlReport, cssReport) {
    const allFeatures = [...htmlReport.features, ...cssReport.features];

    const totalCount = allFeatures.length;
    const overallLevel = lowestBaseline(allFeatures);
    const earliestDate = getEarliestDate(allFeatures);

    const supportSummary = overallLevel === "low"
            ? "Includes some newer or less supported features"
            : "All features are well supported across modern browsers";

    return {
        featureCount: totalCount,
        baselineLevel: overallLevel,
        supportSummary,
        earliestDate
    };
}