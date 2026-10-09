using System;
using System.Collections.Generic;

public class Stack<T>
{
    private readonly List<T> items = new List<T>();

    public void Push(T value)
    {
        items.Add(value);
    }

    public T Pop()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Empty stack");
        }
        T value = items[items.Count - 1];
        items.RemoveAt(items.Count - 1);
        return value;
    }

    public T Peek()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Empty stack");
        }
        return items[items.Count - 1];
    }

    public bool IsEmpty()
    {
        return items.Count == 0;
    }
}
