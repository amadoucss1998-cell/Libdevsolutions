import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(2);

// Use the pre-installed Chromium headless shell instead of downloading one.
const headless = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
Config.setBrowserExecutable(headless);
Config.setChromiumOpenGlRenderer("angle");
