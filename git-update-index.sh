#
# src 하위의 변경점을 추적하지 않음.
find src/ -type f -exec git update-index --assume-unchanged '{}' \;