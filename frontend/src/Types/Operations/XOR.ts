type XOR<T, U> = (T | U) extends object
    ? (T & U extends object
        ? (Exclude<T, U> | Exclude<U, T>)
        : T | U)
    : T | U;

export default XOR;