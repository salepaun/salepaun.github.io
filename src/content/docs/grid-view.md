---
title: GridView
description: Virtualized grid with uniform or non-uniform cell sizing.
sidebar:
  order: 32
---

Virtualized scrollable grid with uniform or variable cell sizing. Recycles items via object pooling for large datasets.

## Inspector Setup

1. Create a container with `AutoLayout` and `AutoLayoutScrollView`.
2. Add the **GridView** component.
3. Register prefabs in the **Prefabs** list.
4. Set item count and configure columns via code.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Scroll Direction | GridViewScrollDirection | Vertical | Scroll axis |
| Size Mode | GridViewSizeMode | Uniform | Uniform or NonUniform cell sizes |
| Column Count | int | 0 | Columns (0 = auto-calculate from width) |
| Column Gap | float | 0 | Horizontal gap between cells |
| Row Gap | float | 0 | Vertical gap between rows |
| Virtualized | bool | true | Enable object pooling |
| Default Pool Capacity | int | 20 | Initial pool size per prefab type |
| Overscan Count | int | 1 | Extra rows rendered offscreen |
| Prefabs | List | - | Prefab registrations (typeId + prefab + capacity) |

## Code Usage

### AutoUI Builder

```csharp
AutoUI.Create()
    .WidthFill().HeightFill()
    .Padding(16)
    .GridView(gv => gv
        .Columns(3)
        .Gap(10)
        .Virtualized(true)
        .Prefab(cellPrefab, 30)
        .ItemCount(items.Count)
        .GetItem(i => items[i])
        .BindItem((go, index, data) =>
        {
            var view = go.GetComponent<MyCellView>();
            view.Bind((MyItem)data);
        })
        .UnbindItem((go, index) =>
        {
            var view = go.GetComponent<MyCellView>();
            view.Unbind();
        })
        .Capture(g => m_GridView = g))
    .Build();
```

The configure lambda is **optional**. Omit it to add an empty grid and configure it later through the captured reference:

```csharp
AutoUI.Create().WidthFill().HeightFill().GridView().Build();
```

### Using IGridViewDelegate

```csharp
public class MyScreen : MonoBehaviour, IGridViewDelegate
{
    private GridView m_GridView;

    void Start()
    {
        AutoUI.Create()
            .Fill()
            .GridView(gv => gv
                .Columns(4)
                .Gap(8)
                .Prefab(cellPrefab, 20)
                .Delegate(this)
                .Capture(g => m_GridView = g))
            .Build();
    }

    public int GetNumberOfItems(GridView gridView) => m_Data.Count;
    public int GetItemType(GridView gridView, int index) => 0;

    public void BindItem(GridView gridView, GameObject cell, int index)
    {
        cell.GetComponent<MyCellView>().Bind(m_Data[index]);
    }

    public void UnbindItem(GridView gridView, GameObject cell, int index)
    {
        cell.GetComponent<MyCellView>().Unbind();
    }
}
```

### Runtime Updates

```csharp
m_GridView.ItemCount = newData.Count;
m_GridView.RefreshItems();
m_GridView.ScrollToItem(50, ScrollAlignment.Center, animated: true);
m_GridView.RefreshItem(5);  // Refresh single item
m_GridView.Clear();         // Remove all items
```

## Methods

| Method | Description |
|--------|-------------|
| `RegisterPrefab(int typeId, GameObject prefab, int initialCapacity = 0)` | Register a prefab type |
| `RefreshItems()` | Deferred refresh after data change |
| `RefreshItemsImmediate()` | Synchronous refresh |
| `RefreshItem(int index)` | Refresh a single item |
| `ScrollToItem(int index, ScrollAlignment alignment, bool animated)` | Scroll to show item |
| `Clear()` | Remove all items |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `ItemCount` | int | Total item count |
| `VisibleCount` | int | Currently rendered items |
| `ResolvedColumnCount` | int | Calculated column count |
| `RowCount` | int | Total row count |
| `CellSize` | Vector2 | Resolved cell dimensions |
| `ScrollDirection` | GridViewScrollDirection | Scroll axis |
| `SizeMode` | GridViewSizeMode | Uniform or NonUniform |
| `ColumnCount` | int | Column count (0 = auto) |
| `Virtualized` | bool | Pool mode toggle |

## Events / Callbacks

| Callback | Signature | Description |
|----------|-----------|-------------|
| `GetItemCallback` | `Func<int, object>` | Return data for index |
| `GetItemTypeCallback` | `Func<int, int>` | Return prefab type for index |
| `BindItemCallback` | `Action<GameObject, int, object>` | Bind data to cell |
| `UnbindItemCallback` | `Action<GameObject, int>` | Cleanup on recycle |

## Interfaces

- **`IGridViewItem`** — Implement on prefab root for auto-binding.
- **`IGridViewDelegate`** — Full data source control (overrides callbacks).

## Builder API

| Method | Description |
|--------|-------------|
| `.Columns(int)` | Set column count (0 = auto) |
| `.ColumnGap(float)` | Set horizontal gap |
| `.RowGap(float)` | Set vertical gap |
| `.Gap(float)` | Set both gaps |
| `.SizeMode(GridViewSizeMode)` | Uniform or NonUniform |
| `.Virtualized(bool)` | Enable/disable pooling |
| `.PoolCapacity(int)` | Set default pool size |
| `.Overscan(int)` | Set overscan rows |
| `.Prefab(GameObject, int)` | Register type-0 prefab |
| `.Prefab(int, GameObject, int)` | Register typed prefab |
| `.Delegate(IGridViewDelegate)` | Set delegate |
| `.ItemCount(int)` | Set total items |
| `.GetItem(Func<int, object>)` | Set data callback |
| `.GetItemType(Func<int, int>)` | Set type callback |
| `.BindItem(Action<GameObject, int, object>)` | Set bind callback |
| `.UnbindItem(Action<GameObject, int>)` | Set unbind callback |
| `.Capture(Action<GridView>)` | Capture component reference (e.g. `.Capture(g => m_Grid = g)`) |

## Keyboard Navigation

GridView implements `IMoveHandler` for 2D arrow key / gamepad navigation. Click the grid to select it, then use arrow keys to move focus.

| Direction | Vertical Grid | Horizontal Grid |
|-----------|--------------|-----------------|
| Up | Previous row (`-columnCount`) | Previous item (`-1`) |
| Down | Next row (`+columnCount`) | Next item (`+1`) |
| Left | Previous item (`-1`) | Previous row (`-columnCount`) |
| Right | Next item (`+1`) | Next row (`+columnCount`) |

Navigation stops at boundaries (does not wrap).

```csharp
// Listen for focus changes
m_GridView.OnFocusedIndexChanged += index =>
{
    Debug.Log($"Focused: {index}");
};

// Set focus programmatically
m_GridView.FocusedIndex = 0;
```

| Property / Event | Type | Description |
|-----------------|------|-------------|
| `FocusedIndex` | int | Currently focused item (-1 = none) |
| `OnFocusedIndexChanged` | Action\<int\> | Fired when focused index changes |

## Notes

- `ColumnCount = 0` auto-calculates columns based on available width and cell prefab width.
- `Virtualized = false` instantiates all items upfront (no pooling). Good for small, fixed datasets.
- Overscan renders extra rows above/below the viewport to prevent flicker during fast scrolling.
