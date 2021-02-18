def chunk(_list, chunk_size):
    return [_list[i : i + chunk_size] for i in range(0, len(_list), chunk_size)]


def complete_str(_str, size, filler):
    s = _str[0 : (size - 1)]
    return s + (filler * (size - len(s)))


def snake_to_camel_case(_str):
    return "".join(
        (el if i == 0 else el.title()) for i, el in enumerate(_str.split("_"))
    )


def filter_keys(_dict, keys_to_exclude):
    return {key: value for (key, value) in _dict.items() if key not in keys_to_exclude}


def pop_keys(_dict, keys_to_pop):
    new_dict = {key: value for (key, value) in _dict.items() if key not in keys_to_pop}
    return list(_dict.get(k) for k in keys_to_pop) + [new_dict]
