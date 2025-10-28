# Quick Start: Dynamic Template Page

## 🚀 Penggunaan Cepat

### Basic Usage

#### 1. Riddles (Default)

```
/template/[id]
```

#### 2. Sites

```
/template/[id]?data=sites
```

#### 3. Other Categories

```
/template/[id]?data=[category]
```

---

## 📊 URL Parameters

| Parameter    | Type    | Default   | Description                                  |
| ------------ | ------- | --------- | -------------------------------------------- |
| `data`       | string  | `riddles` | Category data source (riddles, sites)        |
| `format`     | string  | -         | Display mode (`save` untuk show save button) |
| `screenshot` | boolean | false     | Internal: mode screenshot                    |
| `slideIndex` | number  | -         | Internal: index slide untuk screenshot       |

---

## 🎯 Common Use Cases

### View Riddles

```
/template/abc123
```

### View Sites

```
/template/xyz456?data=sites
```

### Save Mode (dengan Save Button)

```
/template/abc123?format=save
/template/xyz456?data=sites&format=save
```

---

## ⚙️ Adding New Category

1. **Create API Endpoint**

    ```
    /app/api/[new-category]/[id]/route.ts
    ```

2. **Update Valid Categories**

    ```typescript
    // In: /app/(template-post)/template/[id]/page.tsx
    const validCategories = ["riddles", "sites", "new-category"];
    ```

3. **Ensure Data Structure**
    ```json
    {
      "data": {
        "carouselData": {
          "slides": [...],
          "caption": "...",
          "hashtags": [...]
        }
      }
    }
    ```

---

## ✅ Valid Categories (Current)

-   ✅ `riddles` - Programming riddles/teka-teki
-   ✅ `sites` - Website showcases

---

## 📝 Examples

### Example 1: Default Riddle

```
URL: /template/67890
API: GET /api/riddles/67890
Result: Riddle slides dengan WARNING_ANSWER auto-inserted
```

### Example 2: Site Showcase

```
URL: /template/12345?data=sites
API: GET /api/sites/12345
Result: Site carousel slides
```

### Example 3: Invalid Category (Fallback)

```
URL: /template/67890?data=invalid
API: GET /api/riddles/67890  ← Fallback to riddles
Result: Riddle slides (default behavior)
```

---

## 🔗 Related Docs

-   [DYNAMIC_TEMPLATE_PAGE.md](./DYNAMIC_TEMPLATE_PAGE.md) - Full technical documentation
-   [DYNAMIC_TEMPLATE_USAGE_EXAMPLES.md](./DYNAMIC_TEMPLATE_USAGE_EXAMPLES.md) - Detailed examples

---

## 💡 Quick Tips

1. **Default is Riddles** - Tidak perlu tambahkan `?data=riddles` untuk riddles
2. **Invalid Category** - Otomatis fallback ke riddles jika category tidak valid
3. **Same Structure** - Semua category harus return struktur `carouselData` yang sama
4. **Case Sensitive** - Parameter `data` case-sensitive (`sites` ≠ `Sites`)

---

## ⚠️ Important Notes

-   ⚠️ ID harus valid MongoDB ObjectId
-   ⚠️ Data harus memiliki `carouselData.slides` yang valid
-   ⚠️ Jika data tidak ditemukan → 404 page
-   ⚠️ Screenshot mode hanya untuk internal usage
