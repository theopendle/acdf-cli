showProp = true

obj = {
    ...(showProp ? { prop: "shown" }: {})
}