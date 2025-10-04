import fs from "fs";
import postcss from "postcss";
import safeParser from "postcss-safe-parser";
import {features} from "web-features";
import scss from "postcss-scss";
import less from "postcss-less";
import {aggregateSupport, getEarliestDate, lowestBaseline} from "../utils/baselineSummarizer.js";

// ----------------------------------------------------- DECLARATIONS
const cssFeatures = Object.entries(features)
    .filter(([_id, f]) => f.compat_features?.some(cf => cf.startsWith("css")))
    .map(([id, f]) => ({
        id,
        name: f.name,
        description: f.description,
        compat: f.compat_features,
        baseline: f.status
    }));

// ----------------------------------------------------- MAIN
const rules = buildRules();
export function analyzeCss(filePath) {
    const css = fs.readFileSync(filePath, "utf8");
    const syntax = getSyntaxByExtension(filePath);
    const root = postcss().process(css, {parser: safeParser, syntax}).root;
    const foundFeatures = new Set();

    root.walk((node) => {
        if (node.type === "decl") {
            const prop = node.prop.toLowerCase();
            const value = node.value;

            for (const r of rules) {
                // CSS Properties
                if (r.category === "properties" && r.part === prop) {
                    foundFeatures.add({name: r.name, description: r.description, status: r.status});
                }

                // CSS Functions
                if (r.category === "functions" && value?.includes(`${r.part}(`)) {
                    foundFeatures.add({name: r.name, description: r.description, status: r.status});
                }
            }
        }
        if (node.type === "atrule") {
            const name = node.name.toLowerCase();
            for (const r of rules) {
                if (r.category === "at-rules" && r.part === name) {
                    foundFeatures.add({name: r.name, description: r.description, status: r.status});
                }
            }
        }
        if (node.type === "rule") {
            const selectorMatches = [...node.selector.matchAll(/::?([\w-]+)/g)];
            for (const match of selectorMatches) {
                const sel = match[1];
                for (const r of rules) {
                    if (r.category === "selectors" && r.part === sel) {
                        foundFeatures.add({name: r.name, description: r.description, status: r.status});
                    }
                }
            }
        }
    });

    return {
        summary: {
            detected_features: foundFeatures.size,
            baseline_level: lowestBaseline([...foundFeatures]),
            support_summary: aggregateSupport([...foundFeatures]),
            baseline_lowest_date: getEarliestDate([...foundFeatures])
        },
        features: [...foundFeatures]
    };
}

// ----------------------------------------------------- TOOLS
function buildRules() {
    const rules = [];

    for (const feat of cssFeatures) {
        for (const compat of feat.compat) {
            const parts = compat.split(".");
            const category = parts[1]; // e.g., "properties", "functions", "at-rules", "selectors"
            const name = parts[2]; // e.g., "aspect-ratio"

            rules.push({
                id: feat.id,
                category,
                part: name,
                name: feat.name,
                description: feat.description,
                status: feat.baseline
            });
        }
    }

    return rules;
}

function getSyntaxByExtension(filePath) {
    if (filePath.endsWith(".scss") || filePath.endsWith(".sass")) return scss;
    if (filePath.endsWith(".less")) return less;
    return undefined; // default CSS
}