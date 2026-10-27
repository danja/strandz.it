---
title: Projects
description: An index of Danny Ayers' 18 music-related projects, grouped by what they do, from synthesizers and audio software to hardware experiments and music releases.
author: Danny Ayers
lang: en
canonical: https://strandz.it/
ogType: website
keywords:
  - projects
  - audio software
  - synthesizers
  - live coding
  - music
  - Danny Ayers
---

# Danny's Recent Music-Related Projects

## Synthesizers & Instruments

### [flues](https://github.com/danja/flues)

A long-running collection of synthesis experiments covering physical modelling, formant
speech synthesis, distortion algorithms, and hybrid instruments. Ideas start as browser
apps (Web Audio API) and often grow into LV2 plugins, native GTK4 apps, and Raspberry Pi
synths. Includes Stove, Chatterbox, Clarinet, Trajectory, Disyn, Floozy, Drumkit, and
around thirty LV2 plugins. [Live demos](https://danja.github.io/flues/)

### [downspout](https://github.com/danja/downspout)

A large collection of mostly generative, algorithmic VST3 plugins built on DPF, with
portable C++ cores, deterministic tests, and custom NanoVG UIs. It spans MIDI generators
(bassgen, melgen, drumgen, arpgen, cadence, ground, luma, lifeform), instruments (syrinx,
floozy, basilico, campione, canticle, moka, plank, pratt), and effects (lightverb, ambo,
rift, orchid, loopdelay, p-mix, e-mix, t-mix).

### [valis](https://github.com/danja/valis)

**Virtual Analog LLM Integrated System** — a standalone app and DAW plugin for building
virtual analog circuits, effectively a factory for instruments and effects. Circuits are
RDF/Turtle descriptions presented through three views: Controls, Circuit, and Code. The
45-element engine is also fully drivable over MCP, so an LLM can design and build circuits.

### [claudius](https://github.com/danja/claudius)

An ESP32 Eurorack synth voice built around *harmonic cascade synthesis*: up to eight
harmonics, each with its own decay envelope, so notes start bright and mellow over time.
Adds wavefolding and Lorenz-attractor chaos modulation. Designed by Claude AI for the
same hardware platform as `disyn-esp32`.

### [disyn-esp32](https://github.com/danja/disyn-esp32)

A Eurorack module built around an ESP32 DevKit V1, running the UI on one core and DSP on
the other. Implements 19 Disyn algorithms plus a calibration test tone, with an OLED UI,
encoder control, CV/pot modulation routing, and I2S DAC output. Marked untested on
hardware in its README.

### [daisy-maybe](https://github.com/danja/daisy-maybe)

A collection of firmwares for the kxmx_bluemchen Eurorack module: DSF synthesis, dual
delay-line resonators, the spectral processors Slime and Uzi, the Dirac granular synth,
and the 17-algorithm Neurotic suite.

## Music Production & Live Coding

### [transmission](https://github.com/danja/transmission)

**A Generative Audio Workstation for Linux.** A graph-based environment for patching VST3
plugins, MIDI generators, instruments, effects, mixers, hardware ports, and system audio
into evolving setups. Patches save as RDF Turtle, render offline to WAV/MP3, and can be
edited live by an LLM through MCP.

### [janey](https://github.com/danja/janey)

Livecoding music in Janet, running in the browser as WebAssembly inside an AudioWorklet,
with a small DSP core written in C. Patches are plain Janet that build a unit-generator
graph, and can be hot-swapped while audio keeps running.

### [dogalog](https://github.com/danja/dogalog)

A realtime Prolog-based livecoding music environment: write logic rules to generate
algorithmic rhythmic patterns and melodies. Browser PWA with a 13-step tutorial,
Euclidean rhythms, scales, chords, probability, and stateful variation.
[Code live](https://danja.github.io/dogalog)

### [melogen](https://github.com/danja/melogen)

Breed melodies and basslines by ear. A genetic algorithm proposes five candidates, you
vote −/0/+, and the next generation is bred from your preferences — you are the fitness
function. Vanilla ES-module PWA with no build step; plays through any
[Jig](https://strandz.it/jigdaw/) plugin and exports `.mid` files.

### [reaper-mcp](https://github.com/danja/reaper-mcp)

A Model Context Protocol server that lets AI agents control the REAPER DAW. Exposes 58
tools across project management, tracks, MIDI, FX and instruments, mixing, mastering,
rendering, and audio analysis.

## Plugin Formats & Catalogues

### [jigdaw](https://github.com/danja/jigdaw)

**A plugin format native to the web.** A plugin is a dereferenceable IRI — fetching it is
installing it — described in Turtle with integrity digests for its Wasm module,
AudioWorklet processor, and UI. The repository carries the normative specification, a
browser host, a VST3 host, 35 worked plugins, and a SHACL validator.

### [plugin-universe](https://github.com/danja/plugin-universe)

An open database of DAW plugins, live at [plugin-universe.com](https://plugin-universe.com):
756 plugins, 63,297 triples, and 288 measurements taken by running the binaries. Built
ontology-first with RDF, SHACL, SPARQL, and embeddings for semantic search, plus a
sandboxed profiler that records what actually happens when a plugin is loaded.

## Audio Analysis & Visualisation

### [bpm](https://github.com/danja/bpm)

A real-time Flutter application that captures microphone audio and runs four BPM
detection algorithms — energy onset, autocorrelation, FFT spectrum, and Haar-wavelet
aggregation — streaming both individual and consensus tempo estimates, with a tempogram
and PLP panel for transparency.

### [fluidmark](https://github.com/danja/fluidmark)

Watermarking for music: mark a track with an identifier and get it back out, inaudibly,
after gain changes, dither, noise, filtering, resampling, cropping, MP3 compression down
to 32 kbit/s, and speed or clock drift. A Rust core compiled to WebAssembly, a browser
front end, Node tools, and an attack harness.

### [hillside](https://github.com/danja/hillside)

An interactive media player with six audio-reactive visualisations: cellular automata,
flocking boids, an abelian sandpile, a Life + Lenia ecosystem, 3D rotating cubes, and a
Chladni plate simulation. [Demo](https://danja.github.io/hillside/)

## Hardware & Retro Computing

### [dog-2](https://github.com/danja/dog-2)

*Danny's Obtuse Gadget v2* — a 1970s-style single-board computer running on an Arduino
Nano with a TM1638 display and keypad. Inspired by the KIM-1 and MK14, with a custom
instruction set, assembler, upload tooling, and an on-device test suite. A 2025 reboot of
Dog-1 for PlatformIO.

## Music Releases

### [attone](https://dannyayers.bandcamp.com/album/attone)

An album by Danny Ayers / *Spike & Wave*, with sleeve art, 16-bit 44.1 kHz WAV files, and
a colophon. Also on
[YouTube](https://www.youtube.com/playlist?list=PLcI4DK1XcRAHjA180H0dYr7Dvaju027RV) and
[Spotify](https://open.spotify.com/album/4RRP11wg5aI3zDugMt3gcr).
