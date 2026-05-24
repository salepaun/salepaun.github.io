---
title: ListView
description: Virtualized list with object pooling, multi-prefab support, and zero-GC generics.
sidebar:
  order: 31
---

Virtualized scrollable list with object pooling. Supports vertical/horizontal direction, multiple prefab types, and zero-GC generics via `VirtualListView<T>`.

## Inspector Setup

1. Create a container with `AutoLayout`.
2. `AutoLayoutScrollView` and `ListView` are added automatically by the builder. For manual setup, add both.
3. Register prefabs in the **Prefabs** list.
4. Set item count and bind data via code.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Direction | ListViewDirection | Vertical | Scroll axis |
| Gap | float | 0 | Gap between items |
| Virtualized | bool | true | Enable object pooling |
| Default Pool Capacity | int | 10 | Initial pool size per type |
| Overscan Count | int | 2 | Extra items rendered offscreen |
| Prefabs | List | - | Prefab registrations (typeId + prefab + capacity) |

## Code Usage

### AutoUI Builder (Single Type)

```csharp
AutoUI.Create()
    .WidthFill().HeightFill()
    .ListView(ListViewDirection.Vertical, lv => lv
        .Prefab(itemPrefab, 15)
        .ItemCount(data.Count)
        .GetItem(i => data[i])
        .BindItem((go, index, data) =>
        {
            go.GetComponent<MyItemView>().Bind((MyData)data);
        })
        .UnbindItem((go, index) =>
        {
            go.GetComponent<MyItemView>().Unbind();
        })
        .Capture(lv => m_ListView = lv))
    .Build();
```

The configure lambda is **optional**. Omit it to add an empty ListView you'll configure later through the captured reference:

```csharp
AutoUI.Create().WidthFill().HeightFill().ListView().Build();
```

### AutoUI Builder (Multi-Type)

```csharp
AutoUI.Create()
    .WidthFill().HeightFill()
    .ListView(ListViewDirection.Vertical, lv => lv
        .Prefab(0, contentPrefab, 15)     // Type 0: content rows
        .Prefab(1, headerPrefab, 5)       // Type 1: section headers
        .ItemCount(flatList.Count)
        .GetItem(i => flatList[i].Data)
        .GetItemType(i => flatList[i].IsHeader ? 1 : 0)
        .BindItem((go, index, data) =>
        {
            if (flatList[index].IsHeader)
                go.GetComponentInChildren<TMP_Text>().text = (string)data;
            else
                go.GetComponent<MyItemView>().Bind((MyData)data);
        })
        .Capture(lv => m_ListView = lv))
    .Build();
```

### Quick Setup (Convenience)

```csharp
m_ListView.Setup(
    prefab: itemPrefab,
    count: data.Count,
    bindItem: (go, index, data) => { /* bind */ },
    getData: i => data[i]
);
```

### Runtime Updates

```csharp
m_ListView.ItemCount = newData.Count;
m_ListView.RefreshItems();                              // Deferred refresh
m_ListView.RefreshItemsImmediate();                     // Synchronous
m_ListView.RefreshItem(5);                              // Single item
m_ListView.ScrollToItem(50, ScrollAlignment.Center);    // Scroll to item
m_ListView.InvalidateItemSize(10);                      // Recalculate item size
m_ListView.Clear();                                     // Remove all
```

## VirtualListView\<T\> (Zero-GC Generic)

For struct data or when you need to avoid boxing:

```csharp
public class MyScreen : MonoBehaviour
{
    private VirtualListView<PlayerData> m_List;

    void Start()
    {
        // VirtualListView<T> is added via AddComponent
        m_List = gameObject.AddComponent<VirtualListView<PlayerData>>();
        m_List.GetItemCallback = i => m_Players[i];         // No boxing
        m_List.BindItemCallback = (go, i, data) =>          // Typed data
        {
            go.GetComponent<PlayerView>().Bind(data);
        };
        m_List.ItemCount = m_Players.Count;
        m_List.RefreshItems();
    }
}
```

### IListViewItem\<T\> Interface

Implement on prefab root for auto-binding without callbacks:

```csharp
public class PlayerView : MonoBehaviour, IListViewItem<PlayerData>
{
    public void Bind(int index, PlayerData data)
    {
        // Bind typed data — no boxing, no casting
    }

    public void Unbind() { }
}
```

## Methods

| Method | Description |
|--------|-------------|
| `RegisterPrefab(int typeId, GameObject prefab, int capacity)` | Register a prefab type |
| `Setup(GameObject prefab, int count, Action bind, Func getData)` | Quick setup |
| `RefreshItems()` | Deferred refresh |
| `RefreshItemsImmediate()` | Synchronous refresh |
| `RefreshItem(int index)` | Refresh single item |
| `ScrollToItem(int index, ScrollAlignment alignment, bool animated)` | Scroll to item |
| `InvalidateItemSize(int index)` | Recalculate item height |
| `InvalidateItemSizesFrom(int startIndex)` | Recalculate from index onward |
| `Clear()` | Remove all items |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `ItemCount` | int | Total item count (set to trigger refresh) |
| `Direction` | ListViewDirection | Vertical or Horizontal |
| `Gap` | float | Gap between items |
| `OverscanCount` | int | Extra items rendered offscreen |
| `VisibleCount` | int | Currently rendered items |
| `CurrentRange` | VisibleRange | Start/end indices of visible items |
| `Virtualized` | bool | Pool mode toggle |
| `ScrollView` | AutoLayoutScrollView | Internal scroll view |

## Callbacks

| Callback | Signature | Description |
|----------|-----------|-------------|
| `GetItemCallback` | `Func<int, object>` | Return data for index |
| `GetItemTypeCallback` | `Func<int, int>` | Return prefab type for index |
| `BindItemCallback` | `Action<GameObject, int, object>` | Bind data to item |
| `UnbindItemCallback` | `Action<GameObject, int>` | Cleanup on recycle |

## Interfaces

- **`IListViewItem`** — Implement on prefab for auto-binding.
- **`IListViewItem<T>`** — Zero-GC typed binding (use with `VirtualListView<T>`).
- **`IListViewDelegate`** — Full data source control (overrides callbacks).

## Builder API

| Method | Description |
|--------|-------------|
| `.Prefab(GameObject, int)` | Register type-0 prefab |
| `.Prefab(int, GameObject, int)` | Register typed prefab |
| `.PoolCapacity(int)` | Set default pool size |
| `.Overscan(int)` | Set overscan count |
| `.Virtualized(bool)` | Enable/disable pooling |
| `.ItemCount(int)` | Set total items |
| `.Delegate(IListViewDelegate)` | Set delegate |
| `.GetItem(Func<int, object>)` | Set data callback |
| `.GetItemType(Func<int, int>)` | Set type callback |
| `.BindItem(Action<GameObject, int, object>)` | Set bind callback |
| `.UnbindItem(Action<GameObject, int>)` | Set unbind callback |
| `.Capture(Action<ListView>)` | Capture reference (e.g. `.Capture(lv => m_List = lv)`) |

## Keyboard Navigation

ListView implements `IMoveHandler` for arrow key / gamepad navigation. Click the list to select it, then use arrow keys to move focus.

| Direction | Vertical List | Horizontal List |
|-----------|--------------|-----------------|
| Up / Left | Previous item | Previous item |
| Down / Right | Next item | Next item |
| Cross-axis | Not consumed (passes through) | Not consumed |

```csharp
// Listen for focus changes
m_ListView.OnFocusedIndexChanged += index =>
{
    Debug.Log($"Focused: {index}");
};

// Set focus programmatically
m_ListView.FocusedIndex = 5;
```

| Property / Event | Type | Description |
|-----------------|------|-------------|
| `FocusedIndex` | int | Currently focused item (-1 = none) |
| `OnFocusedIndexChanged` | Action\<int\> | Fired when focused index changes |

## Notes

- `Virtualized = false` instantiates all items upfront. Use for small, fixed-size lists.
- Overscan renders extra items offscreen to prevent flicker during fast scrolling.
- Pool items are marked `IsVirtualized = true` internally to optimize enable/disable cycles.
- For best performance with struct data, use `VirtualListView<T>` to avoid boxing allocations.
