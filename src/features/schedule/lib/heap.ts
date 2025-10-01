export class Heap<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  private getParentIndex = (index: number) => {
    return Math.floor((index - 1) / 2);
  };

  private getLeftChildIndex = (index: number) => {
    return 2 * index + 1;
  };

  private getRightChildIndex = (index: number) => {
    return 2 * index + 2;
  };

  private hasParent = (index: number) => {
    return this.getParentIndex(index) >= 0;
  };

  private hasLeftChild = (index: number) => {
    return this.getLeftChildIndex(index) < this.heap.length;
  };

  private hasRightChild = (index: number) => {
    return this.getRightChildIndex(index) < this.heap.length;
  };

  private swap = (i: number, j: number) => {
    if (i < 0 || i >= this.heap.length || j < 0 || j >= this.heap.length) return;
    const temp = this.heap[i]!;
    this.heap[i] = this.heap[j]!;
    this.heap[j] = temp;
  };

  private bubbleDown = () => {
    let index = 0;

    while (this.hasLeftChild(index) || this.hasRightChild(index)) {
      let swapIndex = index;

      const leftChildIndex = this.getLeftChildIndex(index);
      const leftChild = this.heap[leftChildIndex];

      if (leftChild && this.comparator(this.heap[swapIndex]!, leftChild) < 0) {
        swapIndex = leftChildIndex;
      }

      const rightChildIndex = this.getRightChildIndex(index);
      const rightChild = this.heap[rightChildIndex];

      if (rightChild && this.comparator(this.heap[swapIndex]!, rightChild) < 0) {
        swapIndex = rightChildIndex;
      }

      if (swapIndex === index) break;

      this.swap(index, swapIndex);
      index = swapIndex;
    }
  };

  private bubbleUp = () => {
    let index = this.heap.length - 1;

    while (this.hasParent(index)) {
      const parentIndex = this.getParentIndex(index);

      if (this.comparator(this.heap[index]!, this.heap[parentIndex]!) <= 0) break;

      this.swap(index, parentIndex);
      index = parentIndex;
    }
  };

  public peek = () => {
    return this.heap.length > 0 ? this.heap[0]! : null;
  };

  public remove = () => {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const item = this.heap[0]!;
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown();
    return item;
  };

  public add = (item: T) => {
    this.heap.push(item);
    this.bubbleUp();
  };
}
