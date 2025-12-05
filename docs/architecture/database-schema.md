# Database Schema

Since Quest Knight MVP uses browser LocalStorage instead of a traditional database, this section defines the LocalStorage schema, serialization format, and data management strategies.

## LocalStorage Schema Definition

**Storage Key:** `quest-knight-state`

**Schema Version:** `1` (for future migrations)

**JSON Structure:**

```json
{
  "version": 1,
  "tasks": [
    {
      "id": "uuid-v4-string",
      "title": "Complete project documentation",
      "description": "Write comprehensive architecture docs",
      "urgency": "urgent",
      "status": "todo",
      "createdAt": 1699900800000,
      "completedAt": null
    }
  ],
  "player": {
    "currentXP": 250,
    "currentLevel": 3,
    "xpForNextLevel": 500,
    "totalTasksCompleted": 5,
    "totalDragonsDefeated": 2,
    "totalGoblinsDefeated": 3
  },
  "lastSaved": 1699900900000
}
```

**Schema Constraints:**

- **Maximum Size:** 5MB (LocalStorage browser limit, varies by browser)
- **Character Encoding:** UTF-8
- **Format:** Valid JSON (no circular references, no undefined values)
- **Versioning:** Schema version field enables future migrations

## Data Type Mapping

| TypeScript Type | JSON Representation | Example | Notes |
|----------------|---------------------|---------|-------|
| `string` | String | `"urgent"` | Direct mapping |
| `number` | Number | `1699900800000` | Timestamps as milliseconds since epoch |
| `boolean` | Boolean | `true` | Direct mapping |
| `null` | Null | `null` | Used for optional fields (completedAt) |
| `Date` | Number | `1699900800000` | Converted to timestamp for serialization |
| `Task[]` | Array | `[{...}, {...}]` | Array of task objects |
| `Player` | Object | `{currentXP: 250, ...}` | Nested object |

## Data Not Persisted (Ephemeral State)

The following state is **intentionally NOT saved** to LocalStorage:

**Enemies Array:**
- Regenerated from active tasks on application load
- Position calculations performed fresh each session
- Rationale: Saves storage space, positions may change with viewport size

**Game State:**
- Battle animations always start fresh (no mid-battle persistence)
- Knight returns to idle state on page load
- Rationale: Simpler logic, animations should complete or reset

**UI State:**
- Modal open/closed states
- Selected task for editing
- Documentation preview pane visibility
- Rationale: Standard session state, expected to reset on reload

## Storage Management Strategy

**Persistence Events:**
1. Task created/updated/deleted
2. Player XP/level changed
3. Battle completed (task marked done)
4. Browser storage event (cross-tab sync)

**Storage Quota Management:**

When LocalStorage quota is exceeded:
1. Archive completed tasks older than 30 days
2. Retry persist with cleaned state
3. If still fails, show critical error with export option

**Cross-Tab Synchronization:**

LocalStorage changes in one tab trigger events in other tabs via `storage` event listener. Store automatically rehydrates and regenerates enemies when external changes detected.

