export function getBaselineHighPercentage(features) {
    if (!features.length) return 0;

    const highCount = features.filter(f => f.status?.baseline === "high").length;
    const percentage = (highCount / features.length) * 100;

    return Math.round(percentage * 10) / 10; // round to 1 decimal place
}

function getBaselineDistribution(features) {
    const distribution = {
        low: 0,
        medium: 0,
        high: 0,
        experimental: 0, // means undefined/null baseline
    };

    const total = features.length;
    if (total === 0) return distribution;

    for (const feature of features) {
        const level = feature.status && feature.status.baseline;
        if (level === "low") distribution.low++;
        else if (level === "medium") distribution.medium++;
        else if (level === "high") distribution.high++;
        else distribution.experimental++;
    }

    // Convert counts to percentages
    for (const key in distribution) {
        distribution[key] = Math.round((distribution[key] / total) * 100 * 10) / 10;
    }

    return distribution;
}

export function getEarliestBaselineDate(features) {
    const validDates = features
        .map(f => f.status?.baseline_low_date)
        .filter(date => date && !isNaN(new Date(date.replace(/^≤|≥/, "")).getTime()))
        .map(date => new Date(date.replace(/^≤|≥/, "")));

    if (!validDates.length) return null;

    const earliest = new Date(Math.min(...validDates.map(d => d.getTime())));
    return earliest.toISOString().split("T")[0]; // returns YYYY-MM-DD
}

export function getLatestBaselineDate(features) {
    const validDates = features
        .map(f => f.status?.baseline_low_date)
        .filter(date => date && !isNaN(new Date(date.replace(/^≤|≥/, "")).getTime()))
        .map(date => new Date(date.replace(/^≤|≥/, "")));

    if (!validDates.length) return null;

    const latest = new Date(Math.max(...validDates.map(d => d.getTime())));
    return latest.toISOString().split("T")[0];
}

export function calculateBaselineHealth(features) {
    if (!features.length) return 0;

    const weights = {high: 1.0, medium: 0.6, low: 0.3, experimental: 0.1};

    let total = 0;
    for (const f of features) {
        const baseline = f.status.baseline?.toLowerCase() || "experimental";
        total += weights[baseline] ?? 0.1;
    }

    // Average → scale to percentage
    return Number(((total / features.length) * 100).toFixed(1));
}

function getFeatureAdoptionTimeline(features) {
    const timeline = {};

    for (const feature of features) {
        const dateStr = feature.status && feature.status.baseline_low_date;
        if (!dateStr || typeof dateStr !== "string") continue;

        // Handle weird date formats like "≤2017-04-05"
        const cleanDate = dateStr.replace(/[^\d-]/g, "");
        const date = new Date(cleanDate);

        if (isNaN(date)) continue;

        const year = date.getFullYear();
        timeline[year] = (timeline[year] || 0) + 1;
    }

    // Convert object to sorted array
    return Object.keys(timeline)
        .sort((a, b) => a - b)
        .map(year => ({
            year: Number(year),
            number: timeline[year],
        }));
}

function getFeatureCategoryBreakdown(htmlFeatures, cssFeatures) {
    const htmlCount = htmlFeatures.length;
    const cssCount = cssFeatures.length;
    const total = htmlCount + cssCount;

    if (total === 0) {
        return {html: 0, css: 0};
    }

    return {
        html: Math.round((htmlCount / total) * 100 * 10) / 10,
        css: Math.round((cssCount / total) * 100 * 10) / 10,
    };
}

function calculateOverallHealth(htmlHealth, cssHealth, htmlCount, cssCount) {
    const total = htmlCount + cssCount;
    if (!total) return 0;
    return Number(((htmlHealth * htmlCount + cssHealth * cssCount) / total).toFixed(1));
}

export function getOverallSummary(htmlReport, cssReport) {
    const totalFeatures = htmlReport.summary.featureCount + cssReport.summary.featureCount;
    const features = [...htmlReport.features, ...cssReport.features];

    // Weighted average for baseline coverage
    const baselineCoverage = totalFeatures ?
        Math.round(((htmlReport.summary.baselineCoverage * htmlReport.summary.featureCount
            + cssReport.summary.baselineCoverage * cssReport.summary.featureCount) / totalFeatures * 10) / 10) : 0;

    // Earliest and latest feature adoption across both
    const earliestFeatureAdoption = [
        htmlReport.summary.earliestFeatureAdoption,
        cssReport.summary.earliestFeatureAdoption
    ].filter(Boolean).sort()[0];

    const latestFeatureAdoption = [
        htmlReport.summary.latestFeatureAdoption,
        cssReport.summary.latestFeatureAdoption
    ].filter(Boolean).sort().reverse()[0];

    // Sum non-baseline features
    const nonBaselineFeatureCount = htmlReport.summary.nonBaselineFeatureCount + cssReport.summary.nonBaselineFeatureCount;

    return {
        summary: {
            featureCount: totalFeatures,
            baselineCoverage: baselineCoverage,
            earliestFeatureAdoption: earliestFeatureAdoption,
            latestFeatureAdoption: latestFeatureAdoption,
            nonBaselineFeatureCount: nonBaselineFeatureCount
        },
        charts: {
            baselineDistribution: getBaselineDistribution(features),
            featureAdoptionTimeline: getFeatureAdoptionTimeline(features),
            featureCategoryBreakdown: getFeatureCategoryBreakdown(htmlReport.features, cssReport.features),
            baselineHealth: calculateOverallHealth(htmlReport.summary.baselineHealth, cssReport.summary.baselineHealth, htmlReport.features.length, cssReport.features.length)
        }
    };
}