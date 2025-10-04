#!/usr/bin/env node
import {Command} from "commander";
import {scan} from "../src/index.js";

const program = new Command();

program
    .name("blinescan")
    .description("A CLI tool to index web projects for Baseline compatibility")
    .version("0.0.1");

program
    .command("scan [target]")
    .description("Run a baseline index")
    .option("-j, --json", "Output results as JSON")
    .option("-h, --html", "Generate an HTML dashboard")
    .action((target, options) => {
        scan(target, options);
    });

program.parse(process.argv);