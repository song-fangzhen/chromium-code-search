# Chromium Code Search (CCS)

[![CodeQL workflow](https://github.com/song-fangzhen/chromium-code-search/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/song-fangzhen/chromium-code-search/actions/workflows/codeql-analysis.yml)
[![Bors enabled](https://bors.tech/images/badge_small.svg)](https://app.bors.tech/repositories/38386)

`CCS` gives you a context menu for linking code search path to 
[source.chromium.org](https://source.chromium.org) from
[Chromium Gerrit](https://chromium-review.googlesource.com),
[Google Git](https://chromium.googlesource.com) and
[webdiff-for-coi](https://pypi.org/project/webdiff-for-coi).

## Installation

Install this Chrome Extension from Web Store.

## Usage

- For [Chromium Gerrit](https://chromium-review.googlesource.com): \
right-click on code block and select `Chromium Code Search`, 
it will open the file in [source.chromium.org](https://source.chromium.org) at the selected line.

    <img src="images/CCS02.png" onerror="this.onerror=null; this.remove();" alt="CCS02.png" width="500"/>

- For [Google Git](https://chromium.googlesource.com):

    - click on the line number (optional).
    - choose and right-click on any code block.
    - select `Chromium Code Search`.

    It will open the file in [source.chromium.org](https://source.chromium.org) (at the selected line).

    <img src="images/COI03.png" onerror="this.onerror=null; this.remove();" alt="COI03.png" width="500"/>

- For [webdiff-for-coi](https://pypi.org/project/webdiff-for-coi): \
right-click on code block and select `Chromium Code Search`,
it will open the file in [source.chromium.org](https://source.chromium.org).

    <img src="images/COI04.png" onerror="this.onerror=null; this.remove();" alt="COI04.png" width="500"/>
    
**Enjoy!**
