// ----------------------------------------------------- DECLARATIONS
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

    console.log(features
        .map(f => f.status.baseline_low_date)
        .filter(d => d != null));
    return new Date(Math.min(...dates)).toISOString().split("T")[0];
}