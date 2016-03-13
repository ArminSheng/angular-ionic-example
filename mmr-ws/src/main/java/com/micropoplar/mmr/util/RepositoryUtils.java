package com.micropoplar.mmr.util;

import java.util.LinkedList;
import java.util.List;

public class RepositoryUtils {

  public static <E> List<E> iterableToList(Iterable<E> iterable) {
    List<E> resultList = new LinkedList<E>();

    for (E element : iterable) {
      resultList.add(element);
    }

    return resultList;
  }

}
