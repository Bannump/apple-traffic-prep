# C++ Vector & Struct — Interview Study Guide

A concise reference for **`std::vector`**, **structs**, and **operator overloading** in C++, based on a working example.

---

## 1. Overview

This example covers:

- Defining a **struct** and **overloading `operator<<`** for printing
- Using **`std::vector`** to store and manage a sequence of objects
- **Adding** elements with `push_back`
- **Iterating** with index-based and range-based `for` loops
- **Erasing** elements with iterators

---

## 2. Struct Definition

```cpp
struct Vertex
{
    float x, y, z;
};
```

- **Struct** = aggregate type that groups data (`x`, `y`, `z`).
- No access specifiers → members are **public** by default (unlike `class`, where they are private by default).
- Often used for simple data containers (e.g. 3D points).

**Interview tip:** Know the difference between `struct` and `class` in C++ (default visibility and common conventions).

---

## 3. Operator Overloading (`operator<<`)

```cpp
std::ostream& operator<<(std::ostream& stream, const Vertex& vertex)
{
    stream << vertex.x << ", " << vertex.y << ", " << vertex.z;
    return stream;
}
```

- Allows `std::cout << vertex` to work.
- **Parameters:** `ostream&` (e.g. `cout`), `const Vertex&` (no copy, no modification).
- **Return:** `std::ostream&` so you can chain: `cout << v1 << v2`.
- **Why const reference?** Avoids copying the `Vertex` and promises not to change it.

**Interview tip:** Returning the same `ostream&` enables chaining; returning by value would break it.

---

## 4. `std::vector` Basics

```cpp
std::vector<Vertex> vertices;
```

- **Dynamic array:** size can grow/shrink at runtime.
- **Template:** `vector<Vertex>` stores `Vertex` objects.
- Contiguous storage, random access, amortized O(1) `push_back`.

---

## 5. Adding Elements — `push_back`

```cpp
vertices.push_back({ 1, 2, 3 }); 
vertices.push_back({ 4, 5, 6 });
```

- **`push_back`** adds one element at the end.
- `{ 1, 2, 3 }` is **brace initialization** — constructs a `Vertex` with `x=1, y=2, z=3`.
- `push_back` can **copy** or **move** the object (move when possible in modern C++).

**Interview tip:** Know that repeated `push_back` can cause reallocations; `reserve(n)` can avoid repeated allocations if you know the size.

---

## 6. Iterating — Index-based For Loop

```cpp
for (int i = 0; i < vertices.size(); i++)
{
    std::cout << vertices[i] << std::endl;
}
```

- Use **`vertices.size()`** for the bound (type is `size_t`, often unsigned).
- **`vertices[i]`** — random access; valid for `0 <= i < size()`.
- Good when you need the **index** (e.g. to modify by position or to use `i` in logic).

---

## 7. Iterating — Range-based For Loop (Preferred when index not needed)

```cpp
for (const Vertex& v : vertices)
{
    std::cout << v << std::endl;
}
```

- **Range-based for** — cleaner and less error-prone when you don’t need the index.
- **`const Vertex& v`** — reference to avoid copying each element; `const` because we only read.
- If you wrote `Vertex v` (by value), each element would be **copied**; for small structs it might be acceptable, but by reference is a good default.

**Interview tip:** Prefer range-based for when you don’t need the index; use `const auto&` or `const T&` to avoid copies.

---

## 8. Erasing an Element — `erase` and Iterators

```cpp
if (!vertices.empty())
{
    vertices.erase(vertices.begin() + 1);
}
```

- **`.erase()`** takes an **iterator**, not an index.
- **`vertices.begin()`** — iterator to the first element.
- **`vertices.begin() + 1`** — iterator to the **second** element (index 1).
- **`.empty()`** — check before erase to avoid undefined behavior on an empty vector.
- After erase, **iterators and references** to elements at/after the erased position may be invalidated (don’t reuse them without reassigning).

**Interview tip:**  
- `erase(iterator)` returns an iterator to the element that now occupies that position (or `end()`).  
- Erasing in a loop: prefer iterator-based loop and use the return value of `erase`, or use the erase-remove idiom for “remove all matching”.

---

## 9. Full Example (Reference)

```cpp
#include <iostream>
#include <string>
#include <vector>

struct Vertex
{
    float x, y, z;
};

std::ostream& operator<<(std::ostream& stream, const Vertex& vertex)
{
    stream << vertex.x << ", " << vertex.y << ", " << vertex.z;
    return stream;
}

int main()
{
    std::vector<Vertex> vertices;

    vertices.push_back({ 1, 2, 3 }); 
    vertices.push_back({ 4, 5, 6 });

    for (int i = 0; i < vertices.size(); i++)
        std::cout << vertices[i] << std::endl;

    for (const Vertex& v : vertices)
        std::cout << v << std::endl;

    if (!vertices.empty())
        vertices.erase(vertices.begin() + 1);

    std::cin.get();
    return 0;
}
```

---

## 10. Quick Interview Cheat Sheet

| Topic | Key point |
|-------|-----------|
| **struct vs class** | Default access: `public` vs `private`. |
| **operator<<** | Return `ostream&`, take `ostream&` and `const T&`. |
| **vector** | Dynamic array, contiguous, amortized O(1) push_back. |
| **push_back** | Adds at end; can copy or move. |
| **size()** | Number of elements; type `size_t`. |
| **Iteration** | Index loop when you need index; range-for when you don’t. Use `const T&` in range-for to avoid copies. |
| **erase** | Takes iterator; invalidates iterators/references at or after erased element. |
| **begin() / end()** | Iterators to first and past-the-end. |

---

*Use this doc as a tab alongside your code to review before interviews.*
