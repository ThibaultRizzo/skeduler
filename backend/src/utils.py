def chunk(_list, chunk_size):
    return [_list[i : i + chunk_size] for i in range(0, len(_list), chunk_size)]


def complete_str(_str, size, filler):
    s = _str[0 : (size - 1)]
    return s + (filler * (size - len(s)))
