---
title: Dropdown
description: Popup options selector with optional search filtering.
sidebar:
  order: 34
---

Popup options selector with optional search filtering. Displays a scrollable list of options with auto-direction detection.

## Inspector Setup

1. Add **AutoLayout Dropdown** to a GameObject with `AutoLayout`.
2. Populate the **Options** list in the Inspector.
3. Configure appearance and behavior settings.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Options | List\<string\> | - | List of option strings |
| Selected Index | int | -1 | Currently selected option index |
| Popup Max Height | float | 400 | Maximum popup height in pixels |
| Item Height | float | 48 | Height of each option item |
| Direction | DropdownDirection | Auto | Popup direction: Auto, Up, or Down |
| Searchable | bool | false | Show search/filter field |

## Code Usage

### AutoUI Builder

```csharp
// Basic dropdown — set sizing on the parent before calling .Dropdown()
AutoUI.Create()
    .Width(280).Height(40)
    .Dropdown(d => d
        .Options(new[] { "Option A", "Option B", "Option C" })
        .DefaultIndex(0)
        .PopupMaxHeight(300)
        .OnValueChanged(index => Debug.Log($"Selected: {index}"))
        .Capture(dd => m_Dropdown = dd))
    .Build();

// Searchable dropdown
AutoUI.Create()
    .WidthFill().Height(48)
    .Dropdown(d => d
        .Options(countriesList)
        .DefaultIndex(0)
        .PopupMaxHeight(400)
        .Searchable()
        .OnValueChanged(OnCountryChanged)
        .Capture(dd => m_SearchDropdown = dd))
    .Build();
```

The configure lambda is **optional**. Omit it to add an empty dropdown and populate it later:

```csharp
AutoUI.Create().Width(280).Height(40).Dropdown().Build();
```

> **Sizing note:** `.Dropdown(...)` configures the parent as a `Row` with `CrossAlign(Center)` (the layout the dropdown header needs), but does **not** set Width/Height/Padding — those are your call. Set them on the parent **before** the `.Dropdown(...)` call.

### Programmatic Control

```csharp
// Update options at runtime
m_Dropdown.Options = new List<string> { "New A", "New B", "New C" };

// Change selection
m_Dropdown.SelectedIndex = 1;

// Read selection
string selected = m_Dropdown.SelectedText;
int index = m_Dropdown.SelectedIndex;

// Toggle popup
m_Dropdown.Toggle();
m_Dropdown.Show();
m_Dropdown.Hide();
```

## Methods

| Method | Description |
|--------|-------------|
| `Toggle()` | Open or close the popup |
| `Show()` | Open the popup |
| `Hide()` | Close the popup |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `SelectedIndex` | int | Get/set selected option index |
| `SelectedText` | string | Get the selected option text |
| `IsOpen` | bool | Whether popup is visible |
| `Options` | List\<string\> | Get/set options list |
| `PopupMaxHeight` | float | Maximum popup height |
| `ItemHeight` | float | Per-item height |
| `Direction` | DropdownDirection | Popup direction |
| `Searchable` | bool | Search field enabled |

## Events

| Event | Signature | Description |
|-------|-----------|-------------|
| `OnValueChanged` | `Action<int>` | Fires when selection changes |

## Callbacks

| Callback | Signature | Description |
|----------|-----------|-------------|
| `BindItemCallback` | `Action<GameObject, int, bool>` | Custom item rendering (go, index, isSelected) |
| `UnbindItemCallback` | `Action<GameObject, int>` | Cleanup on item recycle |

## Builder API

| Method | Description |
|--------|-------------|
| `.Options(string[])` / `.Options(List<string>)` | Set option strings |
| `.DefaultIndex(int)` | Set initial selection |
| `.PopupMaxHeight(float)` | Set max popup height |
| `.ItemHeight(float)` | Set item height |
| `.Direction(DropdownDirection)` | Set popup direction |
| `.Searchable()` | Enable search field |
| `.OnValueChanged(Action<int>)` | Subscribe to selection changes |
| `.Capture(Action<AutoLayoutDropdown>)` | Capture component reference |

## Notes

- `Direction = Auto` measures available space above/below and picks the best direction.
- The popup is created in an overlay layer so it renders above other UI.
- Search filtering is case-insensitive substring matching.
