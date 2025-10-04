import fs from "fs";
import {features} from "web-features";
import {parse} from "node-html-parser";
import {aggregateSupport, getEarliestDate, lowestBaseline} from "../utils/baselineSummarizer.js";

// ----------------------------------------------------- DECLARATIONS
const htmlFeatures = Object.entries(features)
    .filter(([_id, f]) => f.compat_features?.some(cf => cf.startsWith("html")))
    .map(([id, f]) => ({
        id,
        name: f.name,
        description: f.description,
        compat: f.compat_features,
        baseline: f.status
    }));

// ----------------------------------------------------- MAIN
const rules = buildRules();
export function analyzeHtml(filePath) {
    const html = fs.readFileSync(filePath, "utf-8");
    const root = parse(html);
    const foundFeatures = new Set();
    const seen = new Set();

    function traverse(node) {
        if (node.tagName) {
            const tag = node.tagName.toLowerCase();
            const attrs = Object.keys(node.attributes || {}).map(a => a.toLowerCase());

            // Check element rules
            for (const r of rules) {
                if (r.type === "element" && r.tag === tag) {
                    if (seen.has(r.name)) continue;
                    foundFeatures.add({name: r.name, description: r.description, status: r.status});
                    seen.add(r.name);
                }
                if (r.type === "element-attr" && r.tag === tag && attrs.includes(r.attr)) {
                    if (seen.has(r.name)) continue;
                    foundFeatures.add({name: r.name, description: r.description, status: r.status});
                    seen.add(r.name);
                }
                if (r.type === "global-attr" && attrs.includes(r.attr)) {
                    if (seen.has(r.name)) continue;
                    foundFeatures.add({name: r.name, description: r.description, status: r.status});
                    seen.add(r.name);
                }
            }
        }

        node.childNodes?.forEach(traverse);
    }

    traverse(root);
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

    for (const feat of htmlFeatures) {
        for (const cf of feat.compat || []) {
            const parts = cf.split(".");

            if (parts[1] === "elements") {
                if (parts.length === 3) {
                    // html.elements.tag
                    rules.push({
                        type: "element",
                        tag: parts[2],
                        name: feat.name,
                        description: feat.description,
                        status: feat.baseline
                    });
                } else if (parts.length === 4) {
                    // html.elements.tag.attribute
                    rules.push({
                        type: "element-attr",
                        tag: parts[2],
                        attr: parts[3],
                        name: feat.name,
                        description: feat.description,
                        status: feat.baseline
                    });
                }
            } else if (parts[1] === "global_attributes") {
                rules.push({
                    type: "global-attr",
                    attr: parts[2],
                    name: feat.name,
                    description: feat.description,
                    status: feat.baseline
                });
            }
        }
    }

    return rules;
}
