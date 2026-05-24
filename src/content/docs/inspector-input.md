---
title: Inspector Input
description: Type units, math expressions, and mode names directly into AutoLayout's inspector fields. The engine parses and adapts.
sidebar:
  order: 12
---

AutoLayout's inspector fields accept more than plain numbers. You can type a unit suffix to switch sizing modes, type a math expression to compute a value, type a mode name on its own to flip modes without losing the number, or combine all three. The engine parses the input and adapts.

This applies to every numeric field on an `AutoLayout` component: Width, Height, Min/Max, Padding, Margin, Gap, WrapGap, ColumnGap, RowGap, plus Grid track templates.

## Type a unit to switch mode

Append a unit suffix to any sizing value. The mode dropdown updates automatically.

| Type this | Mode | Resolves to |
|---|---|---|
| `120px` | Pixels | 120 pixels |
| `50%` | Percentage | 50 % of parent |
| `1.5x` | AspectRatio | width × 1.5 (or height × 1.5) |
| `fill` or `1f` | Fill | 1 weight unit of remaining parent space |
| `hug` | Hug | wrap children + padding |
| `ts` or `textsize` | TextSize | intrinsic TMP bounds |

Typing `120px` into a Width field that was previously set to Hug switches the mode to Pixels and sets the value to `120` — both in one keystroke sequence. Same goes the other way: typing `hug` into a Width field that was `200px` switches the mode to Hug and the previous `200` is irrelevant.

### Aliases

The parser is forgiving. Each mode has multiple ways to spell it:

| Canonical | Also accepted |
|---|---|
| `hug` | `h` |
| `fill` | `f`, `*` |
| `ts` (TextSize) | `t`, `textsize` |
| `auto` (gap distribution) | `sb`, `spread` |
| `even` (gap distribution) | `sa`, `rnd` |

Casing doesn't matter — `Fill`, `FILL`, and `fill` all work.

## Type math to compute a value

Anything you'd type into a calculator works. `+`, `-`, `*`, `/`, and parentheses are all supported.

| Type this | Result |
|---|---|
| `100+50` | 150 |
| `200-32` | 168 |
| `1920/3` | 640 |
| `(16+8)*2` | 48 |
| `100*1.5` | 150 |

Math + unit combine naturally:

| Type this | Mode | Resolves to |
|---|---|---|
| `100+50px` | Pixels | 150 px |
| `(100/3)%` | Percentage | 33.33 % |
| `48*1.5` | Pixels (or current mode) | 72 |

The math evaluator runs `System.Data.DataTable.Compute` under the hood — the same rules as a SQL expression. Floats use a `.` decimal separator.

## Type a mode name on its own

Typing just a unit — no number — switches the mode and keeps the existing value.

| Field was | Type this | Field becomes |
|---|---|---|
| Width = `200px` | `fill` | Width = Fill, weight 200 |
| Width = `Fill 1` | `hug` | Width = Hug |
| Gap = `8` | `auto` | Gap = Space-Between (auto distribution) |

This is the fastest way to flip modes without re-typing the number.

## Gap distribution modes

`Gap` and `WrapGap` accept two extra modes in addition to numeric pixels and percentages:

| Type this | Effect |
|---|---|
| `auto`, `sb`, `spread` | **Space-between** — equal gap between children, no gap at the ends |
| `even`, `sa`, `rnd` | **Space-around** — equal gap before, between, and after children |

Both modes ignore the numeric value and distribute the parent's free space.

## Live-update behavior

While you're typing a **simple number** (no letters, no operators), the engine applies the value live — every keystroke triggers a rebuild so you can watch the layout adjust.

While you're typing anything more complex — a unit, an operator, or a parenthesis — the field waits until you press Enter or move focus before evaluating. This avoids parser errors mid-keystroke (e.g. `100+` is a partial expression; the engine doesn't try to evaluate until you commit).

## Examples

A few patterns that show up often:

```
Width:      1920/3            → 640 px on a 1920-wide canvas
Width:      100%-32px         (not supported — mixed units in one expression)
Height:     16*1.5            → 24 px
Padding:    8+4               → 12 px
Width:      f                 → Fill (weight = current value)
Width:      *                 → Fill (legacy shorthand)
Gap:        auto              → Space-between
WrapGap:    sa                → Space-around
```

**Mixed-unit math is not supported.** The unit is parsed once at the end of the expression; everything before it is a pure-number computation. `100%-32px` parses as the expression `100%-32` followed by the suffix `px`, which fails. Pick one unit per field, and let parent sizing + Padding/Margin handle the offset.

## Related

- [Sizing → Sizing modes](/sizing/#sizing-modes) — the six sizing modes and what each one resolves to
- [Padding](/padding/) · [Margin](/margin/) · [Row & Column → Gap](/row-column/#gap) — pixel and percentage variants
- [Grid → Track sizes](/grid/#track-sizes) — track templates also accept this input syntax (e.g. `1fr 200px repeat(3, 1fr)`)
- [Overview](/overview/) — full per-property reference
