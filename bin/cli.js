#!/usr/bin/env node
import {Command} from "commander";
import {scan} from "../src/index.js";

const program = new Command();

program
    .name("blinescan")
    .description("A CLI tool to index web projects for Baseline compatibility")
    .version("0.0.1");

program
    .description("Run a baseline index")
    .option(
        "--src [target]",
        "Path to the source directory to analyze and generate a Baseline report from"
    )
    .option(
        "--remote [hours]",
        "Upload the report for remote access (optionally specify number of hours, defaults to 24)"
    )
    .action((options) => {
        scan(options);
    });

program.parse(process.argv);