#!/usr/bin/env python3
"""
content-lint.py — Guardia de calidad de encoding para wendygostudio.com
========================================================================
Detecta y repara los 3 bugs de encoding que llegaron a producción el 18-jul-2026:

  1. BOM (EF BB BF) al inicio de archivos HTML/XML/TXT
     -> rompe el <?xml?> del sitemap y ensucia el primer byte del HTML.
  2. Mojibake por doble codificación UTF-8 (UTF-8 leído como cp1252 y
     re-guardado como UTF-8): "â€”" en vez de "—", "ðŸŒ" en vez de "🌐",
     "Ã©" en vez de "é"... Apareció en <title>, og:title y twitter:title
     de blog/index.html -> Google muestra el mojibake en el SERP.
  3. Comillas tipográficas como delimitadores de atributo HTML:
     <meta property=”og:title” content=”...”> -> el atributo NO se parsea,
     la etiqueta es inválida y los previews sociales se rompen.

Uso:
  python3 content-lint.py [--fix] [--quiet] RUTA_A_PUBLIC
    sin --fix : solo informa (exit 1 si hay problemas)
    con --fix : repara lo reparable in-place y re-verifica
                (exit 0 si todo queda limpio, exit 1 si queda algo irreparable)

Sin dependencias externas. La detección de mojibake casa EXACTAMENTE
secuencias UTF-8 leídas como cp1252 "tolerante" (lead byte + continuation
bytes). Un "—" o un "é" legítimos no casan (les faltan continuaciones),
así que el texto sano jamás se toca.
"""
import sys
import re
from pathlib import Path

EXTS = {".html", ".htm", ".xml", ".txt", ".css", ".js", ".json", ".md"}
BOM = b"\xef\xbb\xbf"


def _sloppy_chr(b: int) -> str:
    """byte -> char según cp1252 'tolerante': los 5 codepoints sin mapeo
    (0x81, 0x8D, 0x8F, 0x90, 0x9D) se decodifican como chr(byte), igual
    que hacen los decoders permisivos de Windows que causaron el bug."""
    try:
        return bytes([b]).decode("cp1252")
    except UnicodeDecodeError:
        return chr(b)


# Doble mapeo char->byte: algunos decoders rotos producen los chars de
# cp1252 (0x94 -> ”) y otros los controles C1 de latin-1 (0x94 -> U+0094).
# En producción aparecieron AMBAS variantes mezcladas en el mismo archivo.
_CHAR_TO_BYTE = {}
for _b in range(0x80, 0x100):
    _CHAR_TO_BYTE[_sloppy_chr(_b)] = _b
    _CHAR_TO_BYTE.setdefault(chr(_b), _b)


def _cls(lo: int, hi: int) -> str:
    chars = set()
    for b in range(lo, hi + 1):
        chars.add(_sloppy_chr(b))
        chars.add(chr(b))
    return "[" + "".join(re.escape(c) for c in sorted(chars)) + "]"


_LEAD2 = _cls(0xC2, 0xDF)   # inicio de secuencia UTF-8 de 2 bytes
_LEAD3 = _cls(0xE0, 0xEF)   # 3 bytes (â = 0xE2 -> "â€”", "â€º"…)
_LEAD4 = _cls(0xF0, 0xF4)   # 4 bytes (ð = 0xF0 -> emojis "ðŸŒ…")
_CONT = _cls(0x80, 0xBF)    # bytes de continuación

MOJIBAKE_SEQ = re.compile(
    f"(?:{_LEAD4}{_CONT}{{3}}|{_LEAD3}{_CONT}{{2}}|{_LEAD2}{_CONT})+"
)

# <tag ...=”...”> con comillas tipográficas como delimitador de atributo
CURLY_ATTR = re.compile(
    r"(<[a-zA-Z][^<>]*?)=[\u201c\u201d]([^\u201c\u201d<>]*)[\u201c\u201d]"
)


def repair_mojibake(text: str) -> tuple[str, int]:
    """Repara cada secuencia mojibake por roundtrip sloppy-cp1252 -> UTF-8."""
    count = 0

    def _fix(m: re.Match) -> str:
        nonlocal count
        run = m.group(0)
        raw = bytes(_CHAR_TO_BYTE[c] if c in _CHAR_TO_BYTE else ord(c) for c in run)
        try:
            fixed = raw.decode("utf-8")
        except UnicodeDecodeError:
            return run  # falso positivo rarísimo: no tocar
        count += 1
        return fixed

    return MOJIBAKE_SEQ.sub(_fix, text), count


def lint_file(path: Path, fix: bool) -> list[str]:
    issues = []
    raw = path.read_bytes()
    changed = False

    if raw.startswith(BOM):
        issues.append("BOM al inicio del archivo")
        if fix:
            raw = raw[len(BOM):]
            changed = True

    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as e:
        issues.append(f"NO es UTF-8 válido ({e}) — IRREPARABLE automáticamente")
        if changed:
            path.write_bytes(raw)
        return issues

    if MOJIBAKE_SEQ.search(text):
        if fix:
            text, nrep = repair_mojibake(text)
            if MOJIBAKE_SEQ.search(text):
                issues.append("mojibake UTF-8 doble — reparación PARCIAL, revisar a mano")
            else:
                issues.append(f"mojibake UTF-8 doble ({nrep} secuencias reparadas)")
            changed = True
        else:
            issues.append("mojibake UTF-8 doble (â€, Ã©, ðŸ…)")

    if path.suffix in {".html", ".htm"} and CURLY_ATTR.search(text):
        issues.append("comillas tipográficas como delimitador de atributo HTML")
        if fix:
            while CURLY_ATTR.search(text):
                text = CURLY_ATTR.sub(r'\1="\2"', text)
            changed = True

    if path.suffix in {".html", ".htm"}:
        head = text[:600].lower()
        if "<meta charset" not in head and "http-equiv" not in head:
            issues.append('falta <meta charset="UTF-8"> al inicio del <head> (no auto-reparado)')

    if fix and changed:
        path.write_bytes(text.encode("utf-8"))

    return issues


def main() -> int:
    args = list(sys.argv[1:])
    fix = "--fix" in args
    quiet = "--quiet" in args
    args = [a for a in args if not a.startswith("--")]
    root = Path(args[0]) if args else Path("public")
    if not root.exists():
        print(f"content-lint: ruta no encontrada: {root}", file=sys.stderr)
        return 2

    dirty = 0
    unrepairable = 0
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix not in EXTS:
            continue
        issues = lint_file(path, fix)
        if issues:
            dirty += 1
            bad = any(
                "IRREPARABLE" in i or "PARCIAL" in i or "no auto-reparado" in i
                for i in issues
            )
            if bad:
                unrepairable += 1
            if not quiet:
                mark = "✗" if (bad or not fix) else "✓ reparado"
                print(f"[{mark}] {path}")
                for i in issues:
                    print(f"      - {i}")

    if dirty == 0:
        if not quiet:
            print("content-lint: OK — sin problemas de encoding")
        return 0
    if fix and unrepairable == 0:
        if not quiet:
            print(f"content-lint: {dirty} archivo(s) reparados. OK para deploy.")
        return 0
    print(
        f"content-lint: {unrepairable if fix else dirty} archivo(s) con problemas"
        f"{' irreparables' if fix else ''} — DEPLOY BLOQUEADO",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
