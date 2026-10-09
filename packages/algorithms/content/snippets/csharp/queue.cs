using System;
using System.Collections.Generic;

public class Queue<T>
{
    private readonly LinkedList<T> items = new LinkedList<T>();

    public void Enqueue(T value)
    {
        items.AddLast(value);
    }

    public T Dequeue()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Empty queue");
        }
        T value = items.First.Value;
        items.RemoveFirst();
        return value;
    }

    public T Peek()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Empty queue");
        }
        return items.First.Value;
    }

    public bool IsEmpty()
    {
        return items.Count == 0;
    }
}
