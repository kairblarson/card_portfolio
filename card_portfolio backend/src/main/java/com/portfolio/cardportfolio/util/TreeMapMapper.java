package com.portfolio.cardportfolio.util;

import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class TreeMapMapper {

    public static <K, V> Map<K, V> convertToTreeMap(Map<K, V> hashMap) {
        Map<K, V>
                treeMap = hashMap
                // Get the entries from the hashMap
                .entrySet()

                // Convert the map into stream
                .stream()

                // Now collect the returned TreeMap
                .collect(
                        Collectors

                                // Using Collectors, collect the entries
                                // and convert it into TreeMap
                                .toMap(
                                        Map.Entry::getKey,
                                        Map.Entry::getValue,
                                        (oldValue,
                                         newValue)
                                                -> newValue,
                                        TreeMap::new));

        // Return the TreeMap
        return treeMap;
    }
}
