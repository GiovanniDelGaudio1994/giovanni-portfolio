#!/usr/bin/env python3
"""Create SEO-indexable English pages from the maintained Italian sources.

Translations live in scripts/locale_data.json, not in executable inline JS.
The English pages use the same first-party JS/CSS as the Italian originals.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "scripts/locale_data.json").read_text(encoding="utf-8"))
TEXT_NODE = re.compile(r">([^<>]+)<")


def translate(source: str, section: str) -> str:
    translations = DATA[section]["text"]

    def replace_node(match: re.Match[str]) -> str:
        raw = match.group(1)
        label = raw.strip()
        replacement = translations.get(label)
        if replacement is None:
            return match.group(0)
        prefix = raw[: len(raw) - len(raw.lstrip())]
        suffix = raw[len(raw.rstrip()):]
        return ">" + prefix + replacement + suffix + "<"

    output = TEXT_NODE.sub(replace_node, source)
    for old, new in DATA[section]["attributes"].items():
        if old not in output:
            continue  # Optional attributes may change as the page evolves.
        output = output.replace(old, new)

    output = output.replace('<html lang="it">', '<html lang="en">')
    if section == "portfolio":
        output = output.replace(
            'content="Portfolio ufficiale di Giovanni Del Gaudio, sviluppatore software e studente dell\'Università degli Studi di Salerno. Progetti in Flutter, AI, PHP, Java e web development."',
            'content="Giovanni Del Gaudio, software developer and Computer Science student. Explore projects in Flutter, AI, PHP, Java, systems programming and web development."',
        )
        output = output.replace(
            'content="Software che prende forma. Applicazioni, AI, esperienze digitali e progetti universitari."',
            'content="Software made tangible: applications, AI, digital experiences, hardware research and university projects."',
        )
        output = output.replace('content="it_IT"', 'content="en_US"')
        output = output.replace(
            'content="https://giovannidelgaudio.it/"',
            'content="https://giovannidelgaudio.it/en/"',
            1,  # og:url
        )
        output = output.replace(
            '<link rel="canonical" href="https://giovannidelgaudio.it/">',
            '<link rel="canonical" href="https://giovannidelgaudio.it/en/">',
        )
        output = output.replace(
            '"description":"Software developer e studente universitario, con progetti di app mobile, AI e sviluppo web"',
            '"description":"Software developer and Computer Science student building mobile, web, AI and systems projects"',
        )
        output = output.replace(
            '<title>Giovanni Del Gaudio | Software Developer · Portfolio</title>',
            '<title>Giovanni Del Gaudio | Software Developer · Portfolio (English)</title>',
        )
        output = output.replace(
            'data-locale="it" aria-current="page"',
            'data-locale="it"',
        )
        output = output.replace(
            'data-locale="en" aria-label="English version"',
            'data-locale="en" aria-current="page" aria-label="English version"',
        )
    else:
        output = output.replace(
            'content="LegacyBridge: recupero di vecchi PC e compatibilità Windows 11. Caso studio HP 550 con Core 2 Duo T5670, diagnostica CPU e test Linux Live, senza modificare il disco."',
            'content="LegacyBridge: reviving older PCs and researching Windows 11 compatibility. Real HP 550/Core 2 Duo case study, CPU diagnostics and non-invasive Linux Live tests."',
        )
        output = output.replace(
            '<title>LegacyBridge — Vecchi PC, HP 550 e compatibilità Windows 11</title>',
            '<title>LegacyBridge — Reviving older PCs & Windows 11 research</title>',
        )
        output = output.replace(
            'content="it_IT"', 'content="en_US"',
        )
        output = output.replace(
            'content="LegacyBridge — Recupero vecchi PC e ricerca Windows 11"',
            'content="LegacyBridge — Reviving old PCs & Windows 11 research"',
        )
        output = output.replace(
            'content="HP 550 del 2008: risultati reali, istruzioni CPU e laboratorio pubblico. Windows 11 non ancora avviato."',
            'content="2008 HP 550 research: real findings, CPU instruction limits and an open laboratory. Windows 11 has not been booted."',
        )
        output = output.replace(
            '<meta property="og:url" content="https://giovannidelgaudio.it/legacybridge-demo/">',
            '<meta property="og:url" content="https://giovannidelgaudio.it/legacybridge-demo/en/">',
        )
        output = output.replace(
            'data-locale="it" lang="it" hreflang="it" aria-label="Versione italiana" aria-current="page"',
            'data-locale="it" lang="it" hreflang="it" aria-label="Italian version"',
        )
        output = output.replace(
            'data-locale="en" lang="en" hreflang="en" aria-label="English version"',
            'data-locale="en" lang="en" hreflang="en" aria-label="English version" aria-current="page"',
        )
        output = output.replace(
            '<link rel="canonical" href="https://giovannidelgaudio.it/legacybridge-demo/">',
            '<link rel="canonical" href="https://giovannidelgaudio.it/legacybridge-demo/en/">',
        )

    return output


def translate_portfolio(source: str) -> str:
    return translate(source, "portfolio")


def translate_legacybridge(source: str) -> str:
    return translate(source, "legacybridge")
